import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
})
export class WorkerDashboardComponent implements OnInit, OnDestroy {
  stats: any = { total_reviews: 12, completed_jobs: 7, rating: 4.6 };
  user: any = {
    name: 'Alex Johnson',
    profile_image: '',
  };
  schedule: any[] = [
    {
      id: 1,
      service_name: 'Cleaning',
      client_name: 'Jane Doe',
      booking_date: '2026-03-20T12:00:00Z',
      status: 'pending',
    },
    {
      id: 2,
      service_name: 'Driver',
      client_name: 'Bob Smith',
      booking_date: '2026-03-22T15:30:00Z',
      status: 'accepted',
    },
  ];
  history: any[] = [
    {
      id: 3,
      service_name: 'Cooking',
      client_name: 'Sarah Lee',
      booking_date: '2026-02-10T11:00:00Z',
      status: 'completed',
    },
  ];
  activeTab: 'scheduled' | 'history' = 'scheduled';
  error: string | null = null;
  private currentPath: string = '';
  private sub: Subscription | null = null;

  constructor(
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentPath = this.router.url.split('?')[0];
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentPath = e.urlAfterRedirects.split('?')[0];
      });
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
}

