import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  sidebarOpen = true;
  currentPath = '';

  menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/workers', label: 'Workers', icon: '🧑‍🔧' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/ratings-reviews', label: 'Ratings & Reviews', icon: '⭐' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  constructor(public router: Router) {
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

