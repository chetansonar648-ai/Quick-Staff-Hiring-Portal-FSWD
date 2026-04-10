import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService, AdminDashboardStats, AdminRecentActivity } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats = {
    totalUsers: 0,
    totalWorkers: 0,
    totalClients: 0,
    totalBookings: 0,
  };

  activities: AdminRecentActivity[] = [];

  constructor(
    public router: Router,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });

    this.adminService.getRecentActivity().subscribe({
      next: (res) => {
        this.activities = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

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
    // Not wired to a backend yet.
  }
}
