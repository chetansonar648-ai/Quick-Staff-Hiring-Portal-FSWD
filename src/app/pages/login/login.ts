import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],   // ✅ ADD THIS
  templateUrl: './login.html'
})
export class LoginComponent {

  form = {
    email: '',
    password: ''
  };

  error = '';
  loading = false;
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/auth/login', this.form)
      .subscribe({
        next: (data) => {
          const role = data.user.role;

          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'client') {
            this.router.navigate(['/client']);
          } else if (role === 'worker') {
            this.router.navigate(['/worker/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}