import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ClientRegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

type FieldErrors = Partial<Record<keyof ClientRegisterForm, string>>;

interface RegisterResponse {
  token?: string;
  user?: { role?: string };
}

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

  constructor(private readonly router: Router) {}

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

    // No backend: simulate successful register.
    const simulatedToken = 'mock-token';
    localStorage.setItem('token', simulatedToken);
    localStorage.setItem('qs_token', simulatedToken);
    localStorage.setItem('qs_user', JSON.stringify({ role: 'client' }));

    await this.router.navigate(['/']);
  }
}

