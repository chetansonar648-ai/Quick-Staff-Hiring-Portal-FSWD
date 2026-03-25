import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class ClientProfileComponent {
  defaultClientAvatar = 'https://via.placeholder.com/256';

  activeTab = 'profile';
  profile = {
    name: 'Client',
    email: 'client@example.com',
    phone: '',
    address: '',
    profile_image: '',
  };
  isEditing = false;
  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  };
  loading = false;

  openChangePhotoPrompt(): void {
    if (!this.isEditing) {
      alert("Please click 'Edit Profile' first.");
      return;
    }
    const url = prompt('Enter new profile image URL:', this.profile.profile_image || this.defaultClientAvatar);
    if (url) {
      this.profile = { ...this.profile, profile_image: url };
    }
  }

  handleUpdateProfile(): void {
    this.loading = true;
    // No backend: simulate success
    setTimeout(() => {
      this.isEditing = false;
      this.loading = false;
      alert('Profile updated successfully!');
    }, 300);
  }

  handleChangePassword(): void {
    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      alert('New passwords do not match');
      return;
    }
    this.loading = true;
    // No backend: simulate success
    setTimeout(() => {
      this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
      this.loading = false;
      alert('Password changed successfully!');
    }, 300);
  }

  getProfileImageUrl(): string {
    return this.profile.profile_image || this.defaultClientAvatar;
  }
}

