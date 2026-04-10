import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, catchError, finalize, forkJoin, from, of, filter } from 'rxjs';

import { WorkerService, type WorkerJob, type WorkerStats } from '../../../services/worker.service';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
})
export class WorkerDashboardComponent implements OnInit, OnDestroy {
  loading = true;
  stats: WorkerStats = { total_reviews: 0, completed_jobs: 0, rating: 0 };
  user: { name: string; profile_image?: string } = { name: '', profile_image: '' };
  schedule: WorkerJob[] = [];
  history: WorkerJob[] = [];
  activeTab: 'scheduled' | 'history' = 'scheduled';
  error: string | null = null;
  private currentPath: string = '';
  private sub: Subscription | null = null;

  constructor(
    private readonly router: Router,
    private readonly workerService: WorkerService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentPath = this.router.url.split('?')[0];

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentPath = e.urlAfterRedirects.split('?')[0];
      });

    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  firstName(name: string | undefined): string {
    const n = name || '';
    return n.split(' ')[0] || '';
  }

  formatBookingDate(value: any): string {
    if (!value) return '';
    return new Date(value).toLocaleString();
  }

  formatRating(value: any): string {
    const num = Number(value ?? 0);
    return num.toFixed(1);
  }

  get currentJobs(): any[] {
    return this.activeTab === 'scheduled' ? this.schedule : this.history;
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    forkJoin({
      stats: from(this.workerService.getStats()).pipe(catchError(() => of(this.stats))),
      pendingJobs: from(this.workerService.getJobs('pending')).pipe(catchError(() => of([] as WorkerJob[]))),
      activeJobs: from(this.workerService.getJobs('active')).pipe(catchError(() => of([] as WorkerJob[]))),
      historyJobs: from(this.workerService.getJobs('history')).pipe(catchError(() => of([] as WorkerJob[]))),
      profile: from(this.workerService.getMyProfile()).pipe(catchError(() => of({ name: '', image_url: '' }))),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ stats, pendingJobs, activeJobs, historyJobs, profile }) => {
          const combined = [...pendingJobs, ...activeJobs];
          this.schedule = combined.sort(
            (a, b) => new Date(b.booking_date || '').getTime() - new Date(a.booking_date || '').getTime(),
          );
          this.history = historyJobs;
          this.stats = stats || this.stats;
          this.user = { name: profile?.name || '', profile_image: profile?.image_url };
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = WorkerService.errorMessage(err);
          this.schedule = [];
          this.history = [];
          this.cdr.detectChanges();
        },
      });
  }
}

