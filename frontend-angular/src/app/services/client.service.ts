import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, throwError, timeout } from 'rxjs';

import { environment } from '../../environments/environment';

export interface StaffCard {
  id: number;
  name: string;
  role?: string;
  rating?: number;
  rating_count?: number;
  hourly_rate?: number;
  image_url?: string;
  description?: string;
  skills?: unknown;
}

export interface BrowseCategory {
  category: string;
  count: number;
}

export interface ClientStats {
  active: number;
  completed: number;
  pendingReviews: number;
}

export interface ClientProfileApi {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  role?: string;
}

export interface ClientBookingApi {
  id: number;
  worker_id?: number;
  service_id?: number;
  worker_name?: string;
  worker_role?: string;
  worker_image?: string;
  worker_rating?: number;
  service_type?: string;
  service_description?: string;
  status?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  location_address?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  booking_reference?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
}

export interface CreateBookingPayload {
  worker_id: number;
  service_id: number | null;
  booking_date: string;
  duration_hours: number;
  total_price: number;
  address: string;
  special_instructions?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;
  private readonly requestTimeoutMs = 12000;

  constructor(private readonly http: HttpClient) {}

  private async call<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(
      obs.pipe(
        timeout(this.requestTimeoutMs),
        catchError((err) => throwError(() => err)),
      ),
    );
  }

  async getClientStats(): Promise<ClientStats> {
    const [activeBookings, completedBookings] = await Promise.all([
      this.call(
        this.http.get<any[]>(`${this.baseUrl}/bookings/client`, {
          params: new HttpParams().set('status', 'all_active'),
        })
      ),
      this.call(
        this.http.get<any[]>(`${this.baseUrl}/bookings/client`, {
          params: new HttpParams().set('status', 'completed'),
        })
      ),
    ]);

    const active = activeBookings?.length ?? 0;
    const completed = completedBookings?.length ?? 0;

    // There isn't a separate "pending reviews" status in the mounted bookings routes.
    // For now we map pending reviews to completed jobs so the UI stays consistent.
    return { active, completed, pendingReviews: completed };
  }

  async getRecommendedStaff(limit = 4): Promise<StaffCard[]> {
    const workers = await this.call(this.http.get<any[]>(`${this.baseUrl}/workers`));
    return workers.slice(0, limit).map((w) => this.mapWorkerToStaffCard(w));
  }

  async getBrowseCategories(): Promise<BrowseCategory[]> {
    const categories = await this.call(
      this.http.get<BrowseCategory[]>(`${this.baseUrl}/workers/categories/list`)
    );
    return categories || [];
  }

  async getBrowseStaff(filters: {
    search?: string;
    category?: string;
    location?: string;
    min_price?: string;
    max_price?: string;
    min_rating?: string;
  }): Promise<StaffCard[]> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.min_price) params = params.set('min_price', filters.min_price);
    if (filters.max_price) params = params.set('max_price', filters.max_price);
    if (filters.min_rating) params = params.set('min_rating', filters.min_rating);

    const workers = await this.call(
      this.http.get<any[]>(`${this.baseUrl}/workers`, { params })
    );
    return (workers || []).map((w) => this.mapWorkerToStaffCard(w, true));
  }

  async getClientBookings(): Promise<ClientBookingApi[]> {
    const bookings = await this.call(
      this.http.get<ClientBookingApi[]>(`${this.baseUrl}/bookings/client`),
    );
    return bookings || [];
  }

  async createBooking(payload: CreateBookingPayload): Promise<{ booking?: { id?: number }; booking_reference?: string }> {
    return this.call(
      this.http.post<{ booking?: { id?: number }; booking_reference?: string }>(`${this.baseUrl}/bookings`, payload),
    );
  }

  async saveWorker(workerId: number): Promise<void> {
    await this.call(this.http.post(`${this.baseUrl}/saved-workers`, { worker_id: workerId }));
  }

  async removeSavedWorker(workerId: number): Promise<void> {
    await this.call(this.http.delete(`${this.baseUrl}/saved-workers/${workerId}`));
  }

  async getSavedWorkers(): Promise<StaffCard[]> {
    const saved = await this.call(this.http.get<any[]>(`${this.baseUrl}/saved-workers`));

    // The saved-workers endpoint returns a minimal payload. Enrich each worker using the worker profile endpoint.
    const enriched = await Promise.all(
      (saved || []).map(async (s) => {
        const workerId = s.worker_id as number;
        const profile = await this.call(this.http.get<any>(`${this.baseUrl}/workers/${workerId}`));
        const card = this.mapWorkerToStaffCard(profile, true);
        return {
          ...card,
          id: workerId,
          image_url: card.image_url || profile.image_url,
        };
      })
    );

    return enriched;
  }

  async getMyProfile(): Promise<ClientProfileApi> {
    const me = await this.call(this.http.get<any>(`${this.baseUrl}/auth/me`));
    const u = me?.user || me;
    return {
      name: u?.name ?? '',
      email: u?.email ?? '',
      phone: u?.phone ?? '',
      address: u?.address ?? '',
      profile_image: u?.profile_image_url || u?.profile_image || '',
    };
  }

  getClientProfile(): Observable<ClientProfileApi> {
    return this.http.get<ClientProfileApi>(`${this.baseUrl}/client/profile`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((err) => throwError(() => err)),
    );
  }

  async updateMyProfile(payload: {
    name: string;
    phone?: string;
    address?: string;
    profile_image?: string;
  }): Promise<void> {
    await this.call(this.http.put(`${this.baseUrl}/users/me`, payload));
  }

  private mapWorkerToStaffCard(worker: any, includeSkillsForModal = false): StaffCard {
    const skills = worker?.skills;
    return {
      id: Number(worker?.id ?? worker?.worker_id ?? 0),
      name: worker?.name ?? '',
      role: worker?.role ?? worker?.title,
      rating: worker?.rating ?? 0,
      rating_count: worker?.rating_count ?? 0,
      hourly_rate: worker?.hourly_rate ?? 0,
      image_url: worker?.image_url ?? worker?.profile_image ?? '',
      description: worker?.description ?? worker?.bio ?? '',
      skills: includeSkillsForModal && Array.isArray(skills) ? skills.map((s) => ({ skill_name: s })) : skills,
    };
  }

  static errorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'TimeoutError') {
      return 'Backend is taking too long to respond. Please check that the server is running on http://localhost:5000.';
    }
    if (err && typeof err === 'object' && 'error' in err) {
      const e = err as HttpErrorResponse;
      if (e.status === 0) {
        return 'Cannot reach backend. Please ensure it is running on http://localhost:5000 and try again.';
      }
      return (e.error?.message as string | undefined) || e.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Request failed';
  }
}

