import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardRedirectGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAdmin()) {
      // Allow admin to access /dashboard
      return true;
    } else if (this.auth.isManager()) {
      // Block /dashboard for manager, redirect to manager dashboard
      this.router.navigate(['/manager/dashboard']);
      return false;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
