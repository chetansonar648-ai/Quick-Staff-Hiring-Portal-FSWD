import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

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
  ) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      const statusFromQuery = params.get('status');
      this.statusFilter = statusFromQuery || 'pending';
      void this.loadJobs();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private async loadJobs(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.jobs = await this.workerService.getJobs(this.statusFilter);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
      this.jobs = [];
    } finally {
      this.loading = false;
    }
  }

  getStatusPillClasses(status: string): string {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }

  async handleStatusUpdate(id: number, newStatus: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      await this.workerService.updateJobStatus(id, newStatus as WorkerJobStatus);
      this.jobs = await this.workerService.getJobs(this.statusFilter);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
      this.jobs = [];
    } finally {
      this.loading = false;
    }
  }

  async handleSaveClient(jobId: number): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      await this.workerService.saveClientFromJob(jobId);
      // Refresh list so any backend changes are reflected.
      this.jobs = await this.workerService.getJobs(this.statusFilter);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  isActiveStatus(status: string): boolean {
    return this.statusFilter === status;
  }
}

