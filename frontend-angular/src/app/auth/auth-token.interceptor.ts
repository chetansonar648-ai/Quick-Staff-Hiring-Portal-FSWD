import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { clearAuthSession, getAuthToken } from './token-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = getAuthToken();
    const hasAuthHeader = req.headers.has('Authorization');

    // Debug: log token presence per request (do not log full token)
    try {
      console.debug('[HTTP]', req.method, req.urlWithParams, {
        hasToken: !!token,
        tokenPrefix: token ? token.slice(0, 12) + '…' : null,
        hasAuthHeader,
      });
    } catch {
      // ignore logging failures
    }

    const requestToSend =
      token && !hasAuthHeader
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        : req;

    return next.handle(requestToSend).pipe(
      catchError((err) => {
        // Global auth handling
        if (err && typeof err === 'object' && 'status' in err && (err as any).status === 401) {
          clearAuthSession();
          // Avoid redirect loops if we're already on login
          if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
          }
        }
        try {
          console.error('[HTTP ERROR]', req.method, req.urlWithParams, err);
        } catch {
          // ignore
        }
        return throwError(() => err);
      }),
    );
  }
}
