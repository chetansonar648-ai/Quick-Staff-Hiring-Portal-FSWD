import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
    if (!token) return this.router.parseUrl('/login');

    const rawUser = localStorage.getItem('user') || localStorage.getItem('qs_user');
    let role: string | undefined;
    if (rawUser) {
      try {
        role = JSON.parse(rawUser)?.role as string | undefined;
      } catch {
        role = undefined;
      }
    }
    const url = state.url || '';

    if (url.startsWith('/admin') && role !== 'admin') {
      return this.redirectByRole(role);
    }
    if (url.startsWith('/worker') && role !== 'worker' && role !== 'admin') {
      return this.redirectByRole(role);
    }
    if (url.startsWith('/client') && role !== 'client' && role !== 'admin') {
      return this.redirectByRole(role);
    }

    return true;
  }

  private redirectByRole(role?: string): UrlTree {
    if (role === 'admin') return this.router.parseUrl('/admin/dashboard');
    if (role === 'client') return this.router.parseUrl('/client/dashboard');
    if (role === 'worker') return this.router.parseUrl('/worker/dashboard');
    return this.router.parseUrl('/login');
  }
}

