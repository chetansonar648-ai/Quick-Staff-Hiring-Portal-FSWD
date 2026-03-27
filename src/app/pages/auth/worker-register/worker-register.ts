import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface WorkerRegisterForm {
  name: string;
  skills: string;
  email: string;
  password: string;
  confirm: string;
  summary: string;
  primarySkill: string;
}

type FieldErrors = Partial<Record<keyof WorkerRegisterForm, string>>;

interface RegisterResponse {
  token?: string;
  user?: { role?: string };
}

@Component({
  selector: 'app-auth-worker-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './worker-register.html',
})
export class WorkerRegisterComponent {
  form: WorkerRegisterForm = {
    name: '',
    skills: '',
    email: '',
    password: '',
    confirm: '',
    summary: '',
    primarySkill: '',
  };
  errors: FieldErrors = {};
  serverError = '';

  constructor(private readonly router: Router) {}

  private validate(): boolean {
    const e: FieldErrors = {};
    if (!this.form.name) e.name = 'Full name required';
    if (!this.form.skills) e.skills = 'Profession / skills required';
    else if (!this.form.skills.trim()) e.skills = 'Profession / skills required';

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
    localStorage.setItem('qs_user', JSON.stringify({ role: 'worker' }));

    await this.router.navigate(['/worker/dashboard']);
  }
}

