import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class AuthLoginPageComponent {
  form: LoginForm = { email: '', password: '' };
  errors: LoginErrors = {};
  serverError: string = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  private validate(): boolean {
    const errors: LoginErrors = {};

    if (!this.form.email) {
      errors.email = 'email is a required field';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      errors.email = 'email must be a valid email';
    }

    if (!this.form.password) {
      errors.password = 'password is a required field';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.serverError = '';
    this.errors = {};

    if (!this.validate()) return;

    if (this.loading) return;
    this.loading = true;
    try {
      const res = await this.authService.login(this.form.email, this.form.password);
      const role = res?.user?.role;

      if (role === 'admin') {
        await this.router.navigate(['/admin/dashboard']);
      } else if (role === 'client') {
        await this.router.navigate(['/client/dashboard']);
      } else {
        await this.router.navigate(['/worker/dashboard']);
      }
    } catch (err) {
      this.serverError = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}

