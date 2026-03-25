import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ForgotPasswordForm {
  email: string;
}

type FieldErrors = Partial<Record<keyof ForgotPasswordForm, string>>;

@Component({
  selector: 'app-auth-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent {
  form: ForgotPasswordForm = { email: '' };
  errors: FieldErrors = {};
  sent = false;

  private validate(): boolean {
    const e: FieldErrors = {};
    if (!this.form.email) e.email = 'email is a required field';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) e.email = 'email must be a valid email';
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  onSubmit(): void {
    if (!this.validate()) return;
    this.sent = true;
  }
}

