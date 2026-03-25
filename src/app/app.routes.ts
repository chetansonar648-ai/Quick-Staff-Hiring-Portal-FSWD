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
  { path: 'worker/dashboard', component: WorkerDashboardComponent },
  { path: 'worker/jobs', component: WorkerJobsComponent },
  { path: '**', redirectTo: 'login' },
];
