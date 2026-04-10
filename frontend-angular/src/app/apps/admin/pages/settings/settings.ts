import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminProfile, AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
})
export class AdminSettingsComponent implements OnInit {
  showPasswordModal = false;
  passwordError = '';
  passSaving = false;
  passForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  profile: AdminProfile | null = null;
  loading = true;
  loadError = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.loadError = '';
    this.adminService.getAdminProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadError = AdminService.errorMessage(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  async handleChangePassword(e: Event): Promise<void> {
    e.preventDefault();
    this.passwordError = '';

    if (this.passForm.newPassword !== this.passForm.confirmPassword) {
      this.passwordError = "New passwords don't match!";
      return;
    }

    if (!this.passForm.currentPassword || !this.passForm.newPassword) {
      this.passwordError = 'Please fill all fields';
      return;
    }

    this.passSaving = true;
    try {
      await this.authService.changePassword(this.passForm.currentPassword, this.passForm.newPassword);
      this.showPasswordModal = false;
      this.passForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
    } catch (err) {
      this.passwordError = AuthService.errorMessage(err);
    } finally {
      this.passSaving = false;
      this.cdr.detectChanges();
    }
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  formatJoinedDate(): string {
    const raw = this.profile?.created_at;
    if (!raw) return '';
    try {
      return new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  }

  formatRole(role: string | undefined): string {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}
