import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { setAuthToken, setSessionUser } from '../auth/token-storage';

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

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'worker';
  phone?: string;
  address?: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  availability?: Record<string, unknown>;
}

type ApiAuthEnvelope = {
  success?: boolean;
  message?: string;
  data?: { user: AuthUser; token?: string };
};

export interface MeResponse {
  user:
    | (AuthUser & {
        full_name?: string;
        user_type?: string;
        profile_image_url?: string;
      })
    | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/auth`;

  constructor(private readonly http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem('user') || localStorage.getItem('qs_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private persistSession(user: AuthUser, token: string): void {
    setAuthToken(token);
    setSessionUser(user);
  }

  private unwrapAuth(res: ApiAuthEnvelope & Partial<LoginResponse>): LoginResponse {
    if (res?.data?.user != null && res.data.token != null) {
      return { user: res.data.user, token: res.data.token };
    }
    if (res?.user != null && res?.token != null) {
      return { user: res.user, token: res.token };
    }
    throw new Error(res?.message || 'Unexpected response from server');
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await lastValueFrom(
      this.http.post<ApiAuthEnvelope>(`${this.baseUrl}/login`, { email, password })
    );
    const login = this.unwrapAuth(res);
    this.persistSession(login.user, login.token);
    return login;
  }

  async register(body: RegisterBody): Promise<LoginResponse> {
    const res = await lastValueFrom(
      this.http.post<ApiAuthEnvelope>(`${this.baseUrl}/register`, body)
    );
    const login = this.unwrapAuth(res);
    this.persistSession(login.user, login.token);
    return login;
  }

  async me(): Promise<MeResponse> {
    const res = await lastValueFrom(this.http.get<ApiAuthEnvelope>(`${this.baseUrl}/me`));
    const user = res?.data?.user ?? null;
    if (user) {
      setSessionUser(user);
    }
    return { user };
  }

  async changePassword(current_password: string, new_password: string): Promise<{ success: boolean }> {
    return lastValueFrom(
      this.http.post<{ success: boolean }>(`${this.baseUrl}/change-password`, {
        current_password,
        new_password,
      })
    );
  }

  static errorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const e = err as HttpErrorResponse;
      const body = e.error;
      if (body && typeof body === 'object' && 'message' in body && typeof (body as { message?: string }).message === 'string') {
        return (body as { message: string }).message;
      }
      if (body && typeof body === 'object' && Array.isArray((body as { errors?: { msg?: string }[] }).errors)) {
        const first = (body as { errors: { msg?: string }[] }).errors[0];
        if (first?.msg) return first.msg;
      }
      return e.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Request failed';
  }
}
