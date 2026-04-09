import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  // The React version loads this from a bundled asset import.
  // In Angular we keep it as a static path (it may be missing at runtime, but it won't break compilation).
  loginBg: string = 'assets/login_background.png';

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  error: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    if (this.loading) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const email = (v.email || '').trim();
    const password = v.password || '';

    this.loading = true;
    try {
      console.debug('[LOGIN] submitting', { email });
      const res = await this.authService.login(email, password);
      const role = res?.user?.role;
      console.debug('[LOGIN] success', { role, userId: res?.user?.id });

      if (role === 'admin') {
        await this.router.navigate(['/admin']);
      } else if (role === 'client') {
        await this.router.navigate(['/client']);
      } else {
        await this.router.navigate(['/worker/dashboard']);
      }
    } catch (err) {
      this.error = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}

