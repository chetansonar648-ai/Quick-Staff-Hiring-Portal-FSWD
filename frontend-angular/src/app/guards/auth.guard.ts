import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token') || localStorage.getItem('qs_token');
    if (!token) {
      return this.router.parseUrl('/login');
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles?.length) {
      let role = localStorage.getItem('role');
      if (!role) {
        try {
          const raw = localStorage.getItem('user') || localStorage.getItem('qs_user');
          if (raw) {
            const u = JSON.parse(raw) as { role?: string };
            if (typeof u?.role === 'string') {
              role = u.role;
              localStorage.setItem('role', u.role);
            }
          }
        } catch {
          // ignore
        }
      }
      if (!role || !requiredRoles.includes(role)) {
        return this.router.parseUrl('/login');
      }
    }

    return true;
  }
}

