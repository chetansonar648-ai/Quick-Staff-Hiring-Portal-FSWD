import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

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
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

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

  private buildSkills(): string[] | undefined {
    const fromText = this.form.skills
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const primary = this.form.primarySkill?.trim();
    const merged = [...(primary ? [primary] : []), ...fromText];
    const unique = [...new Set(merged)];
    return unique.length ? unique : undefined;
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
        role: 'worker',
        bio: this.form.summary?.trim() || undefined,
        skills: this.buildSkills(),
      });
      await this.router.navigate(['/worker/dashboard']);
    } catch (err) {
      this.serverError = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}
