import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

export type WorkerJobStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface WorkerJob {
  id: number;
  client_name?: string;
  client_image?: string;
  client_phone?: string;
  client_email?: string;
  address?: string;
  status: string;
  service_name?: string;
  special_instructions?: string;
  booking_date?: string;
}

export interface WorkerStats {
  total_reviews: number;
  completed_jobs: number;
  rating: number;
}

export interface WorkerAvailability {
  [day: string]: { start?: string; end?: string } | undefined;
}

export interface WorkerProfileApi {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  image_url?: string;

  // API uses `role` and `description`
  role?: string;
  description?: string;
  skills?: string[];
  hourly_rate?: number;
  availability?: WorkerAvailability;
  rating?: number;
  rating_count?: number;
  completed_jobs?: number;
  years_of_experience?: number;
  service_location?: string;
  location?: string;

  // Controller also attaches additional data
  reviews?: unknown[];
  booked_dates?: string[];
}

export interface SavedClientApi {
  id: number;
  client_id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profile_image?: string | null;
}

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/workers`;

  constructor(private readonly http: HttpClient) {}

  private unwrapApiData<T>(res: unknown): T {
    const maybe = res as { success?: boolean; data?: T } | T;
    if (maybe && typeof maybe === 'object' && 'success' in (maybe as Record<string, unknown>)) {
      const wrapped = maybe as { success?: boolean; data?: T };
      return (wrapped.data as T) ?? ({} as T);
    }
    return maybe as T;
  }

  async getStats(): Promise<WorkerStats> {
    const url = `${this.baseUrl}/stats`;
    console.log('Calling API:', url);
    const res = await lastValueFrom(this.http.get<unknown>(url));
    return this.unwrapApiData<WorkerStats>(res);
  }

  async getJobs(status: string): Promise<WorkerJob[]> {
    const url = `${this.baseUrl}/jobs`;
    console.log('Calling API:', url, { status });
    const params = new HttpParams().set('status', status);
    const res = await lastValueFrom(this.http.get<unknown>(url, { params }));
    return this.unwrapApiData<WorkerJob[]>(res) || [];
  }

  async updateJobStatus(id: number, status: WorkerJobStatus): Promise<WorkerJob> {
    return lastValueFrom(
      this.http.patch<WorkerJob>(`${this.baseUrl}/jobs/${id}/status`, { status })
    );
  }

  async saveClientFromJob(jobId: number): Promise<{ message: string; client?: unknown; alreadySaved?: boolean }> {
    return lastValueFrom(
      this.http.post<{ message: string; client?: unknown; alreadySaved?: boolean }>(
        `${this.baseUrl}/jobs/${jobId}/save-client`,
        {}
      )
    );
  }

  async getSavedClients(): Promise<SavedClientApi[]> {
    return lastValueFrom(this.http.get<SavedClientApi[]>(`${this.baseUrl}/saved-clients`));
  }

  async getMyProfile(): Promise<WorkerProfileApi> {
    const url = `${this.baseUrl}/me/profile`;
    console.log('Calling API:', url);
    const res = await lastValueFrom(this.http.get<unknown>(url));
    return this.unwrapApiData<WorkerProfileApi>(res);
  }

  async getWorkerProfile(workerId: number): Promise<WorkerProfileApi> {
    return lastValueFrom(this.http.get<WorkerProfileApi>(`${this.baseUrl}/${workerId}`));
  }

  async updateMyProfile(payload: {
    name?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    hourly_rate?: number;
    availability?: WorkerAvailability;
    title?: string;
    years_of_experience?: number;
    address?: string;
    service_location?: string;
  }): Promise<WorkerProfileApi> {
    // Backend expects `PUT /api/workers/me/profile` with the worker profile fields.
    return lastValueFrom(
      this.http.put<WorkerProfileApi>(`${this.baseUrl}/me/profile`, payload)
    );
  }

  async uploadProfilePicture(file: File): Promise<{ profile_image: string; message: string }> {
    const form = new FormData();
    form.append('profile_picture', file);
    return lastValueFrom(
      this.http.post<{ profile_image: string; message: string }>(
        `${this.baseUrl}/me/profile-picture`,
        form
      )
    );
  }

  static errorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const e = err as HttpErrorResponse;
      return (e.error?.message as string | undefined) || e.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Request failed';
  }
}

