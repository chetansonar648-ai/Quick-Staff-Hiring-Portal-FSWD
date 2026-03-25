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
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { AuthGuard } from './guards/auth.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';

export const routes: Routes = [
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
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home').then((m) => m.PublicHomeComponent) },
      { path: 'about', loadComponent: () => import('./pages/public/about/about').then((m) => m.PublicAboutComponent) },
      { path: 'contact', loadComponent: () => import('./pages/public/contact/contact').then((m) => m.PublicContactComponent) },
      { path: 'faq', loadComponent: () => import('./pages/public/faq/faq').then((m) => m.PublicFaqComponent) },
      { path: 'help', loadComponent: () => import('./pages/public/help-center/help-center').then((m) => m.PublicHelpCenterComponent) },
      { path: 'how-it-works', loadComponent: () => import('./pages/public/how-it-works/how-it-works').then((m) => m.PublicHowItWorksComponent) },
      { path: 'privacy', loadComponent: () => import('./pages/public/privacy-policy/privacy-policy').then((m) => m.PublicPrivacyPolicyComponent) },
      { path: 'terms', loadComponent: () => import('./pages/public/terms/terms').then((m) => m.PublicTermsComponent) },
      { path: 'trust-safety', loadComponent: () => import('./pages/public/trust-safety/trust-safety').then((m) => m.PublicTrustSafetyComponent) },
      { path: 'careers', loadComponent: () => import('./pages/public/careers/careers').then((m) => m.PublicCareersComponent) },
      { path: 'categories', loadComponent: () => import('./pages/public/categories/categories').then((m) => m.PublicCategoriesComponent) },
      { path: 'cancellation-policy', loadComponent: () => import('./pages/public/cancellation-policy/cancellation-policy').then((m) => m.PublicCancellationPolicyComponent) },
    ],
  },
  {
    path: 'worker',
    component: WorkerLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/worker/dashboard/dashboard').then((m) => m.WorkerDashboardComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/worker/jobs/jobs').then((m) => m.WorkerJobsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/worker/profile/profile').then((m) => m.WorkerProfileComponent) },
    ],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./apps/client/pages/dashboard/dashboard').then((m) => m.ClientDashboardComponent) },
      { path: 'browse-staff', loadComponent: () => import('./apps/client/pages/browse-staff/browse-staff').then((m) => m.BrowseStaffComponent) },
      { path: 'bookings', loadComponent: () => import('./apps/client/pages/my-bookings/my-bookings').then((m) => m.MyBookingsComponent) },
      { path: 'saved-workers', loadComponent: () => import('./apps/client/pages/saved-workers/saved-workers').then((m) => m.SavedWorkersComponent) },
      { path: 'profile', loadComponent: () => import('./apps/client/pages/profile/profile').then((m) => m.ClientProfileComponent) },
      { path: 'staff/:id', loadComponent: () => import('./apps/client/pages/staff-profile/staff-profile').then((m) => m.StaffProfileComponent) },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./apps/admin/pages/dashboard/dashboard').then((m) => m.AdminDashboardComponent) },
      { path: 'dashboard', loadComponent: () => import('./apps/admin/pages/dashboard/dashboard').then((m) => m.AdminDashboardComponent) },
      { path: 'workers', loadComponent: () => import('./apps/admin/pages/workers/workers').then((m) => m.AdminWorkersComponent) },
      { path: 'clients', loadComponent: () => import('./apps/admin/pages/clients/clients').then((m) => m.AdminClientsComponent) },
      { path: 'bookings', loadComponent: () => import('./apps/admin/pages/bookings/bookings').then((m) => m.AdminBookingsComponent) },
      { path: 'analytics', loadComponent: () => import('./apps/admin/pages/analytics/analytics').then((m) => m.AdminAnalyticsComponent) },
      { path: 'settings', loadComponent: () => import('./apps/admin/pages/settings/settings').then((m) => m.AdminSettingsComponent) },
      { path: 'booking-requests', loadComponent: () => import('./apps/admin/pages/booking-requests/booking-requests').then((m) => m.AdminBookingRequestsComponent) },
      { path: 'ratings-reviews', loadComponent: () => import('./apps/admin/pages/ratings-reviews/ratings-reviews').then((m) => m.AdminRatingsReviewsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
