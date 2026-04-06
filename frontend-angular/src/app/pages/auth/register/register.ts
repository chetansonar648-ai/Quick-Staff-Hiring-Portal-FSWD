import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'worker' | '';
}

type FieldErrors = Partial<Record<keyof RegisterForm, string>>;

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  form: RegisterForm = { name: '', email: '', password: '', role: '' };
  errors: FieldErrors = {};
  serverError = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  private validate(): boolean {
    const e: FieldErrors = {};
    if (!this.form.name) e.name = 'name is a required field';
    if (!this.form.email) e.email = 'email is a required field';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) e.email = 'email must be a valid email';
    if (!this.form.password) e.password = 'password is a required field';
    else if (this.form.password.length < 6) e.password = 'password must be at least 6 characters';
    if (!this.form.role) e.role = 'role is a required field';
    else if (!['client', 'worker'].includes(this.form.role)) e.role = 'role must be one of the following values: client, worker';

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.serverError = '';
    this.errors = {};

    if (!this.validate()) return;

    this.loading = true;
    try {
      await this.authService.register({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        password: this.form.password,
        role: this.form.role as 'client' | 'worker',
      });

      if (this.form.role === 'worker') {
        await this.router.navigate(['/worker/dashboard']);
      } else {
        await this.router.navigate(['/client']);
      }
    } catch (err) {
      this.serverError = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}
