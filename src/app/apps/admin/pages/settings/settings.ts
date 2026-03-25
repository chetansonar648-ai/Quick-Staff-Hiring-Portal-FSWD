import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
})
export class AdminSettingsComponent {
  showPasswordModal = false;
  passForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  adminProfile = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    userId: '1',
    joinedDate: '2024-01-15',
  };

  handleChangePassword(e: Event): void {
    e.preventDefault();

    if (this.passForm.newPassword !== this.passForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (!this.passForm.currentPassword || !this.passForm.newPassword) {
      alert('Please fill all fields');
      return;
    }

    alert('Password updated successfully!');
    this.showPasswordModal = false;
    this.passForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  formatJoinedDate(): string {
    try {
      return new Date(this.adminProfile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  }
}

