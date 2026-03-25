import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  // The React version loads this from a bundled asset import.
  // In Angular we keep it as a static path (it may be missing at runtime, but it won't break compilation).
  loginBg: string = 'assets/login_background.png';

  form: { email: string; password: string } = { email: '', password: '' };
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

    const email = (this.form.email || '').trim();
    const password = this.form.password || '';

    if (!email) {
      this.error = 'Email is required';
      return;
    }
    if (!password) {
      this.error = 'Password is required';
      return;
    }

    this.loading = true;
    try {
      const res = await this.authService.login(email, password);
      const role = res?.user?.role;

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

