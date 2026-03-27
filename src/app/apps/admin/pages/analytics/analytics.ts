import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
})
export class AdminAnalyticsComponent {
  chartData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 18 },
    { month: 'Mar', value: 9 },
    { month: 'Apr', value: 24 },
  ];
  topServices = [
    { name: 'Cleaning', count: 32 },
    { name: 'Moving', count: 21 },
  ];
  metrics: any = { total_users: 0, total_workers: 0, total_clients: 0, total_bookings: 0 };
  deviceStats = [
    { device: 'Desktop', percentage: 62 },
    { device: 'Mobile', percentage: 34 },
    { device: 'Tablet', percentage: 4 },
  ];
  trafficStats = [
    { source: 'Direct', percentage: 40 },
    { source: 'Search', percentage: 35 },
    { source: 'Social', percentage: 25 },
  ];
  loading = false;

  get maxValue(): number {
    return this.chartData.length > 0 ? Math.max(...this.chartData.map((d) => Number(d.value) || 0)) || 10 : 100;
  }

  toNumber(v: any): number {
    return Number(v) || 0;
  }
}

