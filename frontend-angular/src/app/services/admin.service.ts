import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AdminDashboardStats {
  totalUsers: number;
  totalWorkers: number;
  totalClients: number;
  totalBookings: number;
}

export interface AdminRecentActivity {
  user: string;
  action: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin`;

  constructor(private readonly http: HttpClient) {}

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.baseUrl}/stats`);
  }

  getRecentActivity(): Observable<AdminRecentActivity[]> {
    return this.http.get<AdminRecentActivity[]>(`${this.baseUrl}/recent-activity`);
  }
}
