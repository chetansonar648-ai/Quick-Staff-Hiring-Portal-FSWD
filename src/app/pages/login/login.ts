import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface LoginResponse {
  token?: string;
  user: {
    role: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  // The React version loads this from a bundled asset import.
  // In Angular we keep it as a static path (it may be missing at runtime, but it won't break compilation).
  loginBg: string = 'assets/login_background.png';

  form: { email: string; password: string } = { email: '', password: '' };
  error: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(private readonly router: Router) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    // No backend: simulate a successful login without changing the UI layout.
    this.loading = false;

    const simulatedToken = 'mock-token';
    localStorage.setItem('token', simulatedToken);
    localStorage.setItem('qs_token', simulatedToken);

    const email = (this.form.email || '').toLowerCase();
    const role =
      email.includes('admin') ? 'admin' : email.includes('client') ? 'client' : 'worker';

    if (role === 'admin') {
      await this.router.navigate(['/admin']);
    } else if (role === 'client') {
      await this.router.navigate(['/client']);
    } else {
      await this.router.navigate(['/worker/dashboard']);
    }
  }
}

