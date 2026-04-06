import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

interface ClientRegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

type FieldErrors = Partial<Record<keyof ClientRegisterForm, string>>;

@Component({
  selector: 'app-auth-client-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-register.html',
})
export class ClientRegisterComponent {
  form: ClientRegisterForm = { name: '', email: '', password: '', confirm: '' };
  errors: FieldErrors = {};
  serverError = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  private validate(): boolean {
    const e: FieldErrors = {};
    if (!this.form.name) e.name = 'Full name required';
    if (!this.form.email) e.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) e.email = 'Email required';

    if (!this.form.password) e.password = 'Password required';
    else if (this.form.password.length < 6) e.password = 'Password required';

    if (!this.form.confirm) e.confirm = 'Passwords must match';
    else if (this.form.confirm !== this.form.password) e.confirm = 'Passwords must match';

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
        role: 'client',
      });
      await this.router.navigate(['/client']);
    } catch (err) {
      this.serverError = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}
