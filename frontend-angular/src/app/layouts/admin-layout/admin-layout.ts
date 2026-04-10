import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  sidebarOpen = true;
  currentPath = '';

  get headerDisplayName(): string {
    const name = this.authService.getCurrentUser()?.name?.trim();
    return name || 'Admin';
  }

  menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/workers', label: 'Workers', icon: '🧑‍🔧' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/ratings-reviews', label: 'Ratings & Reviews', icon: '⭐' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  constructor(
    public router: Router,
    private authService: AuthService,
  ) {
    this.currentPath = this.router.url;
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.currentPath = ev.urlAfterRedirects || ev.url || this.router.url;
      }
    });
  }

  isActive(path: string): boolean {
    if (path === '/admin') {
      return this.currentPath === '/admin' || this.currentPath === '/admin/';
    }
    return this.currentPath.startsWith(path);
  }
}

