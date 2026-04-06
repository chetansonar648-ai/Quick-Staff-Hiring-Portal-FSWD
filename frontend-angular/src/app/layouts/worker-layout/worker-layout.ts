import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-worker-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './worker-layout.html',
})
export class WorkerLayoutComponent implements OnInit, OnDestroy {
  private sub: Subscription | null = null;
  currentPath: string = '';
  currentUrl: string = '';

  user: { name: string; profile_image: string } = {
    name: '',
    profile_image: '',
  };

  // Jobs sidebar status filter (mirrors React Jobs.jsx query param behavior)
  statusFilter: string = 'pending';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const session = this.authService.getCurrentUser();
    if (session) {
      this.user = {
        name: session.name || '',
        profile_image: session.profile_image || '',
      };
    }
    this.updateFromUrl(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateFromUrl(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateFromUrl(url: string): void {
    this.currentUrl = url;
    this.currentPath = url.split('?')[0];

    if (this.isJobsRoute()) {
      const qs = url.includes('?') ? url.split('?')[1] : '';
      const params = new URLSearchParams(qs);
      this.statusFilter = params.get('status') || 'pending';
    }
  }

  isJobsRoute(): boolean {
    return this.currentPath === '/worker/jobs';
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  isActiveStatus(status: string): boolean {
    return this.statusFilter === status;
  }
}

