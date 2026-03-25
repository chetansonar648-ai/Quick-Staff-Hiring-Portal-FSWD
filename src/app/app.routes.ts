import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { ClientRegisterComponent } from './pages/auth/client-register/client-register';
import { WorkerRegisterComponent } from './pages/auth/worker-register/worker-register';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password';
import { AuthLoginPageComponent } from './pages/auth/login/login';
import { VerifyEmailPageComponent } from './pages/auth/verify-email/verify-email';
import { ResetPasswordPageComponent } from './pages/auth/reset-password/reset-password';
import { ChangePasswordPageComponent } from './pages/auth/change-password/change-password';
import { WorkerDashboardComponent } from './pages/worker/dashboard/dashboard';
import { WorkerJobsComponent } from './pages/worker/jobs/jobs';
import { WorkerLayoutComponent } from './layouts/worker-layout/worker-layout';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login-page', component: AuthLoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/client', component: ClientRegisterComponent },
  { path: 'register/worker', component: WorkerRegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
  { path: 'change-password', component: ChangePasswordPageComponent },
  {
    path: 'worker',
    component: WorkerLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/worker/dashboard/dashboard').then((m) => m.WorkerDashboardComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/worker/jobs/jobs').then((m) => m.WorkerJobsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/worker/profile/profile').then((m) => m.WorkerProfileComponent) },
    ],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./apps/client/pages/dashboard/dashboard').then((m) => m.ClientDashboardComponent) },
      { path: 'browse-staff', loadComponent: () => import('./apps/client/pages/browse-staff/browse-staff').then((m) => m.BrowseStaffComponent) },
      { path: 'bookings', loadComponent: () => import('./apps/client/pages/my-bookings/my-bookings').then((m) => m.MyBookingsComponent) },
      { path: 'saved-workers', loadComponent: () => import('./apps/client/pages/saved-workers/saved-workers').then((m) => m.SavedWorkersComponent) },
      { path: 'profile', loadComponent: () => import('./apps/client/pages/profile/profile').then((m) => m.ClientProfileComponent) },
      { path: 'staff/:id', loadComponent: () => import('./apps/client/pages/staff-profile/staff-profile').then((m) => m.StaffProfileComponent) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
