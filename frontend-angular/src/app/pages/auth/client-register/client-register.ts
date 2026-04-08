import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-client-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-register.html',
})
export class ClientRegisterComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = '';
  showSuccess = false;
  private successTimer: ReturnType<typeof setTimeout> | null = null;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: [this.matchPasswordsValidator] });

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnDestroy(): void {
    if (this.successTimer) clearTimeout(this.successTimer);
  }

  private matchPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private startSuccessRedirect(): void {
    if (this.successTimer) clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  handleSuccessClose(): void {
    this.router.navigate(['/login']);
  }

  get f() {
    return this.form.controls;
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const v = this.form.getRawValue();
      await this.authService.register({
        name: (v.name || '').trim(),
        email: (v.email || '').trim(),
        password: v.password || '',
        phone: v.phone || '',
        address: v.address || '',
        role: 'client',
      });
      this.showSuccess = true;
      this.startSuccessRedirect();
    } catch (err) {
      this.error = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }
}
