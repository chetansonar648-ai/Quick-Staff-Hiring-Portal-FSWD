import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
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
    private readonly authService: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('Stored user:', localStorage.getItem('user'));
    this.currentPath = this.router.url.split('?')[0];
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentPath = e.urlAfterRedirects.split('?')[0];
      });

    void this.loadDashboardData();
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

  private async loadDashboardData(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.user = { name: currentUser.name || '', profile_image: currentUser.profile_image || '' };
      }
      console.log('User:', this.user);

      const [stats, pendingJobs, activeJobs, historyJobs] = await Promise.all([
        this.workerService.getStats(),
        this.workerService.getJobs('pending'),
        this.workerService.getJobs('active'),
        this.workerService.getJobs('history'),
      ]);
      console.log('Stats:', stats);
      console.log('Jobs:', { pendingJobs, activeJobs, historyJobs });

      // "Scheduled" in UI includes pending + accepted/active jobs.
      const combined = [...(pendingJobs || []), ...(activeJobs || [])];
      this.schedule = combined.sort((a, b) => new Date(b.booking_date || '').getTime() - new Date(a.booking_date || '').getTime());
      this.history = historyJobs || [];
      this.stats = stats || this.stats;

      // We reuse `getMyProfile` to show the user's name in the header.
      const profile = await this.workerService.getMyProfile();
      console.log('Profile:', profile);
      this.user = { name: profile?.name || '', profile_image: profile?.image_url };
    } catch (err) {
      console.error('Dashboard Error:', err);
      this.error = WorkerService.errorMessage(err);
      this.schedule = [];
      this.history = [];
    } finally {
      this.loading = false;
    }
  }
}

