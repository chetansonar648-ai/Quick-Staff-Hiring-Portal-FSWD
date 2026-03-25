import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { setAuthToken } from '../auth/token-storage';

export type AuthRole = 'client' | 'worker' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AuthRole | string;
  phone?: string | null;
  address?: string | null;
  profile_image?: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface MeResponse {
  user: (AuthUser & {
    full_name?: string;
    user_type?: string;
    profile_image_url?: string;
  }) | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/auth`;

  constructor(private readonly http: HttpClient) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await lastValueFrom(
      this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
    );

    if (res?.token) setAuthToken(res.token);
    return res;
  }

  async me(): Promise<MeResponse> {
    return lastValueFrom(this.http.get<MeResponse>(`${this.baseUrl}/me`));
  }

  static errorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const e = err as HttpErrorResponse;
      return (
        (e.error?.message as string | undefined) ||
        (e.error?.errors?.[0]?.msg as string | undefined) ||
        e.message ||
        'Request failed'
      );
    }
    return err instanceof Error ? err.message : 'Request failed';
  }
}

