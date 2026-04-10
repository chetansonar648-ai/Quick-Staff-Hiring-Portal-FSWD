import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AdminClientRow {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean;
  booking_count?: number;
  total_spent?: string | number | null;
}

export interface AdminWorkerRow {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  is_active?: boolean;
  rating?: number | string | null;
  completed_jobs?: number | null;
}

export interface AdminBookingRow {
  id: number;
  client_id?: number;
  worker_id?: number;
  service_id?: number;
  booking_date?: string;
  total_price?: string | number;
  status?: string;
  payment_status?: string;
  client_name?: string;
  worker_name?: string;
  service_name?: string;
}

export interface AdminJobRequestRow {
  id: number;
  title?: string;
  client_id?: number;
  worker_id?: number;
  service_id?: number;
  client_name?: string;
  worker_name?: string;
  service_name?: string;
  requested_date?: string;
  status?: string;
  description?: string;
}

export interface AdminReviewRow {
  id: number;
  booking_id?: number;
  reviewer_id?: number;
  reviewee_id?: number;
  rating?: number;
  comment?: string | null;
  created_at?: string;
  client_name?: string;
  worker_name?: string;
  service_name?: string | null;
}

export interface AdminServiceRow {
  id: number;
  name: string;
}

export interface AdminMonthlyPoint {
  month: string;
  value: string | number;
}

export interface AdminTopServiceRow {
  name: string;
  count: string | number;
}

export interface AdminDeviceStat {
  device: string;
  percentage: number;
}

export interface AdminTrafficStat {
  source: string;
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  /** Routes under /api/admin (stats, recent activity). */
  private readonly apiAdmin = `${environment.apiBaseUrl}/api/admin`;
  /** Legacy admin panel routes mounted at server root (same origin). */
  private readonly root = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  static errorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const e = err as HttpErrorResponse;
      const body = e.error;
      if (body && typeof body === 'object') {
        const msg = (body as { message?: string; error?: string }).message;
        const er = (body as { error?: string }).error;
        if (typeof msg === 'string') return msg;
        if (typeof er === 'string') return er;
      }
      if (e.status === 0) {
        return 'Cannot reach the server. Ensure the backend is running.';
      }
      return e.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Request failed';
  }

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiAdmin}/stats`);
  }

  getRecentActivity(): Observable<AdminRecentActivity[]> {
    return this.http.get<AdminRecentActivity[]>(`${this.apiAdmin}/recent-activity`);
  }

  getAdminProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>(`${this.apiAdmin}/profile`);
  }

  getClients(): Observable<AdminClientRow[]> {
    return this.http.get<AdminClientRow[]>(`${this.root}/clients`);
  }

  postClient(body: { name: string; email: string; phone?: string; address?: string }): Observable<AdminClientRow> {
    return this.http.post<AdminClientRow>(`${this.root}/clients`, body);
  }

  putUserStatus(id: number, is_active: boolean): Observable<{ id: number; is_active: boolean }> {
    return this.http.put<{ id: number; is_active: boolean }>(`${this.root}/users/${id}/status`, { is_active });
  }

  getWorkers(): Observable<AdminWorkerRow[]> {
    return this.http.get<AdminWorkerRow[]>(`${this.root}/workers`);
  }

  postWorker(body: { name: string; email: string; phone?: string }): Observable<AdminWorkerRow> {
    return this.http.post<AdminWorkerRow>(`${this.root}/workers`, body);
  }

  putWorker(id: number, body: { name?: string; email?: string; phone?: string }): Observable<AdminWorkerRow> {
    return this.http.put<AdminWorkerRow>(`${this.root}/workers/${id}`, body);
  }

  deleteWorker(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.root}/workers/${id}`);
  }

  getServices(): Observable<AdminServiceRow[]> {
    return this.http.get<AdminServiceRow[]>(`${this.root}/services`);
  }

  getBookings(): Observable<AdminBookingRow[]> {
    return this.http.get<AdminBookingRow[]>(`${this.root}/bookings`);
  }

  postBooking(body: Record<string, unknown>): Observable<AdminBookingRow> {
    return this.http.post<AdminBookingRow>(`${this.root}/bookings`, body);
  }

  putBooking(id: number, body: { status?: string; payment_status?: string }): Observable<AdminBookingRow> {
    return this.http.put<AdminBookingRow>(`${this.root}/bookings/${id}`, body);
  }

  deleteBooking(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.root}/bookings/${id}`);
  }

  getRequests(status?: string): Observable<AdminJobRequestRow[]> {
    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    return this.http.get<AdminJobRequestRow[]>(`${this.root}/requests`, { params });
  }

  postRequest(body: Record<string, unknown>): Observable<AdminJobRequestRow> {
    return this.http.post<AdminJobRequestRow>(`${this.root}/requests`, body);
  }

  putRequest(id: number, body: { status: string }): Observable<AdminJobRequestRow> {
    return this.http.put<AdminJobRequestRow>(`${this.root}/requests/${id}`, body);
  }

  getReviews(): Observable<AdminReviewRow[]> {
    return this.http.get<AdminReviewRow[]>(`${this.root}/reviews`);
  }

  postReview(body: {
    client_id: number;
    worker_id: number;
    booking_id: number;
    rating: number;
    comment?: string;
  }): Observable<AdminReviewRow> {
    return this.http.post<AdminReviewRow>(`${this.root}/reviews`, body);
  }

  deleteReview(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.root}/reviews/${id}`);
  }

  getAnalyticsMonthly(): Observable<AdminMonthlyPoint[]> {
    return this.http.get<AdminMonthlyPoint[]>(`${this.root}/admin/analytics/monthly`);
  }

  getAnalyticsTopServices(): Observable<AdminTopServiceRow[]> {
    return this.http.get<AdminTopServiceRow[]>(`${this.root}/admin/analytics/top-services`);
  }

  getAnalyticsDevices(): Observable<AdminDeviceStat[]> {
    return this.http.get<AdminDeviceStat[]>(`${this.root}/admin/analytics/devices`);
  }

  getAnalyticsTraffic(): Observable<AdminTrafficStat[]> {
    return this.http.get<AdminTrafficStat[]>(`${this.root}/admin/analytics/traffic`);
  }
}
