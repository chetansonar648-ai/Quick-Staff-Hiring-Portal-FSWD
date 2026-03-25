import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ChangePasswordErrors {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

@Component({
  selector: 'app-auth-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.html',
})
export class ChangePasswordPageComponent {
  form: ChangePasswordForm = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  };
  errors: ChangePasswordErrors = {};
  message: string = '';
  serverError: string = '';

  constructor() {}

  private validate(): boolean {
    const errors: ChangePasswordErrors = {};

    if (!this.form.current_password) {
      errors.current_password = 'current_password is required';
    }

    if (!this.form.new_password) {
      errors.new_password = 'new_password is a required field';
    } else if (this.form.new_password.length < 6) {
      errors.new_password = 'new_password must be at least 6 characters';
    }

    if (!this.form.confirm_password) {
      errors.confirm_password = 'confirm_password is a required field';
    } else if (this.form.confirm_password !== this.form.new_password) {
      errors.confirm_password = 'Passwords must match';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.serverError = '';
    this.message = '';
    this.errors = {};

    if (!this.validate()) return;
    // No backend: simulate password change.
    this.message = 'Password updated.';
    this.form = { current_password: '', new_password: '', confirm_password: '' };
  }
}

