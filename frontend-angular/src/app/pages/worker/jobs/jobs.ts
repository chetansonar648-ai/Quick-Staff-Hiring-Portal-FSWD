import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, finalize, from, switchMap } from 'rxjs';

import { WorkerService, type WorkerJob, type WorkerJobStatus } from '../../../services/worker.service';

@Component({
  selector: 'app-worker-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './jobs.html',
})
export class WorkerJobsComponent implements OnInit, OnDestroy {
  statusFilter: string = 'pending'; // Default to requests
  jobs: WorkerJob[] = [];
  loading = false;
  error: string | null = null;

  titles: Record<string, string> = {
    pending: 'Job Requests',
    accepted: 'Accepted Jobs',
    in_progress: 'Active Job',
    completed: 'Past Jobs',
    rejected: 'Rejected Jobs',
    cancelled: 'Cancelled Jobs',
  };

  private sub: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly workerService: WorkerService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      const statusFromQuery = params.get('status');
      this.statusFilter = statusFromQuery || 'pending';
      this.loadJobs();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadJobs(): void {
    this.loading = true;
    this.error = null;
    from(this.workerService.getJobs(this.statusFilter))
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = WorkerService.errorMessage(err);
          this.jobs = [];
          this.cdr.detectChanges();
        },
      });
  }

  getStatusPillClasses(status: string): string {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }

  handleStatusUpdate(id: number, newStatus: string): void {
    this.loading = true;
    this.error = null;
    from(this.workerService.updateJobStatus(id, newStatus as WorkerJobStatus))
      .pipe(
        switchMap(() => from(this.workerService.getJobs(this.statusFilter))),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = WorkerService.errorMessage(err);
          this.jobs = [];
          this.cdr.detectChanges();
        },
      });
  }

  handleSaveClient(jobId: number): void {
    this.loading = true;
    this.error = null;
    from(this.workerService.saveClientFromJob(jobId))
      .pipe(
        switchMap(() => from(this.workerService.getJobs(this.statusFilter))),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (jobs) => {
          this.jobs = jobs;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = WorkerService.errorMessage(err);
          this.cdr.detectChanges();
        },
      });
  }

  isActiveStatus(status: string): boolean {
    return this.statusFilter === status;
  }
}

