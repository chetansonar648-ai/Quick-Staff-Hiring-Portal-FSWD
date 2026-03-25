import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class AdminDashboardComponent {
  constructor(public router: Router) {}

  stats = [
    { label: 'Total Users', value: '0', change: '+0%', icon: '👥', color: '#3b82f6' },
    { label: 'Total Workers', value: '0', change: '+0%', icon: '🧑‍🔧', color: '#10b981' },
    { label: 'Total Clients', value: '0', change: '+0%', icon: '🛒', color: '#f59e0b' },
    { label: 'Total Bookings', value: '0', change: '+0%', icon: '📈', color: '#8b5cf6' },
  ];

  recentActivities: Array<{ user: string; action: string; time: string }> = [
    { user: 'Client ID 1', action: 'Booked Service ID 1', time: new Date().toLocaleString() },
    { user: 'Client ID 2', action: 'Booked Service ID 2', time: new Date().toLocaleString() },
  ];

  handleAddUser(): void {
    this.router.navigate(['/admin/clients']);
  }

  handleViewReports(): void {
    this.router.navigate(['/admin/analytics']);
  }

  handleManageSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  handleSendNotification(): void {
    alert('Notification sender not wired yet.');
  }
}

