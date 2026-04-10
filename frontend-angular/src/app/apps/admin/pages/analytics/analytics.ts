import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import {
  AdminDeviceStat,
  AdminMonthlyPoint,
  AdminService,
  AdminTopServiceRow,
  AdminTrafficStat,
} from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
})
export class AdminAnalyticsComponent implements OnInit {
  chartData: AdminMonthlyPoint[] = [];
  topServices: AdminTopServiceRow[] = [];
  metrics: { totalUsers: number; totalWorkers: number; totalClients: number; totalBookings: number } = {
    totalUsers: 0,
    totalWorkers: 0,
    totalClients: 0,
    totalBookings: 0,
  };
  deviceStats: AdminDeviceStat[] = [];
  trafficStats: AdminTrafficStat[] = [];
  loading = false;
  error = '';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      stats: this.adminService.getDashboardStats(),
      monthly: this.adminService.getAnalyticsMonthly(),
      topServices: this.adminService.getAnalyticsTopServices(),
      devices: this.adminService.getAnalyticsDevices(),
      traffic: this.adminService.getAnalyticsTraffic(),
    }).subscribe({
      next: ({ stats, monthly, topServices, devices, traffic }) => {
        this.metrics = {
          totalUsers: stats.totalUsers ?? 0,
          totalWorkers: stats.totalWorkers ?? 0,
          totalClients: stats.totalClients ?? 0,
          totalBookings: stats.totalBookings ?? 0,
        };
        this.chartData = monthly || [];
        this.topServices = topServices || [];
        this.deviceStats = devices || [];
        this.trafficStats = traffic || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get maxValue(): number {
    return this.chartData.length > 0
      ? Math.max(...this.chartData.map((d) => Number(d.value) || 0)) || 10
      : 100;
  }

  toNumber(v: unknown): number {
    return Number(v) || 0;
  }
}
