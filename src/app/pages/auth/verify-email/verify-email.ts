import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface VerifyEmailForm {
  email: string;
  otp: string;
}

interface VerifyEmailErrors {
  email?: string;
  otp?: string;
}

@Component({
  selector: 'app-auth-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-email.html',
})
export class VerifyEmailPageComponent {
  form: VerifyEmailForm = { email: '', otp: '' };
  errors: VerifyEmailErrors = {};
  step: number = 1;
  message: string = '';
  serverError: string = '';

  constructor() {}

  private validate(): boolean {
    const errors: VerifyEmailErrors = {};

    if (!this.form.email) {
      errors.email = 'email is a required field';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      errors.email = 'email must be a valid email';
    }

    if (this.step === 2) {
      if (!this.form.otp) {
        errors.otp = 'otp is required';
      } else if (this.form.otp.length !== 6) {
        errors.otp = 'otp must be 6 digits';
      }
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.serverError = '';
    this.message = '';
    this.errors = {};

    if (!this.validate()) return;

    // No backend: simulate verification flow.
    if (this.step === 1) {
      this.step = 2;
      this.message = 'OTP sent to your email.';
    } else {
      this.message = 'Email verified successfully.';
    }
  }
}

