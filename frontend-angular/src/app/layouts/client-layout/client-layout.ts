import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

const navLinkBase =
  'flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium';

const pageTitleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/browse-staff': 'Browse Staff',
  '/bookings': 'My Bookings',
  '/bookings/upcoming': 'Upcoming Bookings',
  '/bookings/active': 'Active Bookings',
  '/bookings/completed': 'Completed Jobs',
  '/bookings/cancelled': 'Cancelled Jobs',
  '/bookings/reviews': 'Pending Reviews',
  '/saved-workers': 'Saved Workers',
  '/payments/history': 'Payment History',
  '/payments/receipt': 'Receipt',
  '/profile': 'My Profile',
};

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './client-layout.html',
})
export class ClientLayoutComponent implements OnInit, OnDestroy {
  navLinkBase = navLinkBase;

  currentPath = '/';
  title = 'Client Dashboard';

  user = {
    name: 'Client',
    image: 'https://via.placeholder.com/64',
  };

  private sub?: Subscription;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.syncFromRouter();
    this.sub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.syncFromRouter();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private syncFromRouter(): void {
    const url = this.router.url || '/client';
    const path = url.startsWith('/client') ? url.slice('/client'.length) : url;
    this.currentPath = path || '/';
    this.title = pageTitleMap[this.currentPath] || 'Client Dashboard';
  }

  isActive(path: string, exact = false): boolean {
    if (exact) return this.currentPath === path;
    return this.currentPath === path || this.currentPath.startsWith(path + '/');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('qs_token');
    this.router.navigate(['/login']);
  }
}

