import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, lastValueFrom, throwError, timeout, catchError } from 'rxjs';

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
    try {
      console.debug('[AUTH] session persisted', {
        userId: user?.id,
        role: user?.role,
        tokenPrefix: token ? token.slice(0, 12) + '…' : null,
      });
    } catch {
      // ignore
    }
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
    const res = await this.call(
      this.http.post<ApiAuthEnvelope>(`${this.baseUrl}/login`, { email, password }),
    );
    const login = this.unwrapAuth(res);
    this.persistSession(login.user, login.token);
    return login;
  }

  async register(body: RegisterBody): Promise<LoginResponse> {
    const res = await this.call(
      this.http.post<ApiAuthEnvelope>(`${this.baseUrl}/register`, body),
    );
    const login = this.unwrapAuth(res);
    this.persistSession(login.user, login.token);
    return login;
  }

  async me(): Promise<MeResponse> {
    const res = await this.call(this.http.get<ApiAuthEnvelope>(`${this.baseUrl}/me`));
    const user = res?.data?.user ?? null;
    if (user) {
      setSessionUser(user);
    }
    return { user };
  }

  async changePassword(current_password: string, new_password: string): Promise<{ success: boolean }> {
    return this.call(
      this.http.post<{ success: boolean }>(`${this.baseUrl}/change-password`, {
        current_password,
        new_password,
      }),
    );
  }

  static errorMessage(err: unknown): string {
    // RxJS timeout() throws a generic Error with name "TimeoutError"
    if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'TimeoutError') {
      return 'Backend is taking too long to respond. Please check that the server is running on http://localhost:5000.';
    }
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
      if (e.status === 0) {
        return 'Cannot reach backend. Please ensure it is running on http://localhost:5000 and try again.';
      }
      return e.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Request failed';
  }
}
