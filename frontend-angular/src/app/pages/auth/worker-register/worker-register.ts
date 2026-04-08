// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';

// import { AuthService } from '../../../services/auth.service';

// interface WorkerRegisterForm {
//   name: string;
//   skills: string;
//   email: string;
//   password: string;
//   confirm: string;
//   summary: string;
//   primarySkill: string;
// }

// type FieldErrors = Partial<Record<keyof WorkerRegisterForm, string>>;

// @Component({
//   selector: 'app-auth-worker-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './worker-register.html',
// })
// export class WorkerRegisterComponent {
//   form: WorkerRegisterForm = {
//     name: '',
//     skills: '',
//     email: '',
//     password: '',
//     confirm: '',
//     summary: '',
//     primarySkill: '',
//   };
//   errors: FieldErrors = {};
//   serverError = '';
//   loading = false;

//   constructor(
//     private readonly router: Router,
//     private readonly authService: AuthService,
//   ) {}

//   private validate(): boolean {
//     const e: FieldErrors = {};
//     if (!this.form.name) e.name = 'Full name required';
//     if (!this.form.skills) e.skills = 'Profession / skills required';
//     else if (!this.form.skills.trim()) e.skills = 'Profession / skills required';

//     if (!this.form.email) e.email = 'Email required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) e.email = 'Email required';

//     if (!this.form.password) e.password = 'Password required';
//     else if (this.form.password.length < 6) e.password = 'Password required';

//     if (!this.form.confirm) e.confirm = 'Passwords must match';
//     else if (this.form.confirm !== this.form.password) e.confirm = 'Passwords must match';

//     this.errors = e;
//     return Object.keys(e).length === 0;
//   }

//   private buildSkills(): string[] | undefined {
//     const fromText = this.form.skills
//       .split(/[,;]/)
//       .map((s) => s.trim())
//       .filter(Boolean);
//     const primary = this.form.primarySkill?.trim();
//     const merged = [...(primary ? [primary] : []), ...fromText];
//     const unique = [...new Set(merged)];
//     return unique.length ? unique : undefined;
//   }

//   async onSubmit(): Promise<void> {
//     this.serverError = '';
//     this.errors = {};

//     if (!this.validate()) return;

//     this.loading = true;
//     try {
//       await this.authService.register({
//         name: this.form.name.trim(),
//         email: this.form.email.trim(),
//         password: this.form.password,
//         role: 'worker',
//         bio: this.form.summary?.trim() || undefined,
//         skills: this.buildSkills(),
//       });
//       await this.router.navigate(['/worker/dashboard']);
//     } catch (err) {
//       this.serverError = AuthService.errorMessage(err);
//     } finally {
//       this.loading = false;
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';

// @Component({
//   selector: 'app-worker-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './worker-register.html'
// })
// export class WorkerRegisterComponent implements OnInit {

//   form = {
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     address: '',
//     skills: '',
//     hourly_rate: '',
//     terms: false
//   };

//   error = '';
//   loading = false;
//   showPassword = false;
//   showConfirmPassword = false;
//   showSuccess = false;

//   constructor(private auth: AuthService, private router: Router) {}

//   ngOnInit(): void {
//     if (this.showSuccess) {
//       setTimeout(() => {
//         this.router.navigate(['/login']);
//       }, 3000);
//     }
//   }

//   onSubmit() {
//     this.error = '';

//     if (this.form.password !== this.form.confirmPassword) {
//       this.error = 'Passwords do not match';
//       return;
//     }

//     if (!this.form.terms) {
//       this.error = 'Please agree to the Terms and Conditions';
//       return;
//     }

//     this.loading = true;

//     const skillsArray = this.form.skills
//       ? this.form.skills.split(',').map(s => s.trim()).filter(Boolean)
//       : [];

//     const hourlyRateNum = this.form.hourly_rate
//       ? parseFloat(this.form.hourly_rate)
//       : null;

//     const payload = {
//       name: this.form.name,
//       email: this.form.email,
//       password: this.form.password,
//       phone: this.form.phone,
//       address: this.form.address,
//       skills: skillsArray,
//       hourly_rate: hourlyRateNum,
//       role: 'worker'
//     };

//     this.auth.register(payload).subscribe({
//       next: () => {
//         this.showSuccess = true;

//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 3000);
//       },
//       error: (err: any) => {
//         this.error = err.error?.message || 'Registration failed';
//       },
//       complete: () => {
//         this.loading = false;
//       }
//     });
//   }

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPassword() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   closeSuccess() {
//     this.router.navigate(['/login']);
//   }
// }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule, Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';

// @Component({
//   selector: 'app-worker-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule], // ✅ IMPORTANT
//   templateUrl: './worker-register.html'
// })
// export class WorkerRegisterComponent {

//   form = {
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     address: '',
//     skills: '',
//     hourly_rate: '',
//     terms: false
//   };

//   error = '';
//   loading = false;
//   showPassword = false;
//   showConfirmPassword = false;

//   constructor(private auth: AuthService, private router: Router) {}

//   async onSubmit() {
//     this.error = '';

//     if (this.form.password !== this.form.confirmPassword) {
//       this.error = 'Passwords do not match';
//       return;
//     }

//     if (!this.form.terms) {
//       this.error = 'Please agree to Terms';
//       return;
//     }

//     this.loading = true;

//     const payload = {
//       name: this.form.name,
//       email: this.form.email,
//       password: this.form.password,
//       phone: this.form.phone,
//       address: this.form.address,
//       skills: this.form.skills.split(',').map(s => s.trim()),
//       hourly_rate: this.form.hourly_rate
//         ? parseFloat(this.form.hourly_rate)
//         : undefined,
//       role: 'worker' as const
//     };

//     try {
//       await this.auth.register(payload);
//       this.router.navigate(['/login']);
//     } catch (err: any) {
//       this.error = AuthService.errorMessage(err);
//     } finally {
//       this.loading = false;
//     }
//   }

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPassword() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-worker-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './worker-register.html',
})
export class WorkerRegisterComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  showSuccess = false;

  readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      skills: [''],
      hourly_rate: [''],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: [this.matchPasswordsValidator] },
  );

  private successTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
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

      const skillsArray = v.skills ? v.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const hourlyRateNum = v.hourly_rate ? parseFloat(v.hourly_rate) : undefined;

      await this.auth.register({
        name: (v.name || '').trim(),
        email: (v.email || '').trim(),
        password: v.password || '',
        phone: v.phone || '',
        address: v.address || '',
        skills: skillsArray.length ? skillsArray : undefined,
        hourly_rate: Number.isFinite(hourlyRateNum) ? hourlyRateNum : undefined,
        role: 'worker',
      });

      this.showSuccess = true;
      this.startSuccessRedirect();
    } catch (err) {
      this.error = AuthService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}