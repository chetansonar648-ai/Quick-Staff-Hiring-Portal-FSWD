import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ResetPasswordForm {
  password: string;
  confirm: string;
}

interface ResetPasswordErrors {
  password?: string;
  confirm?: string;
}

@Component({
  selector: 'app-auth-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordPageComponent {
  form: ResetPasswordForm = { password: '', confirm: '' };
  errors: ResetPasswordErrors = {};
  done: boolean = false;

  private validate(): boolean {
    const errors: ResetPasswordErrors = {};

    if (!this.form.password) {
      errors.password = 'password is a required field';
    } else if (this.form.password.length < 6) {
      errors.password = 'password must be at least 6 characters';
    }

    if (!this.form.confirm) {
      errors.confirm = 'confirm is a required field';
    } else if (this.form.confirm !== this.form.password) {
      errors.confirm = 'Passwords must match';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  onSubmit(): void {
    if (!this.validate()) return;
    this.done = true;
  }
}

