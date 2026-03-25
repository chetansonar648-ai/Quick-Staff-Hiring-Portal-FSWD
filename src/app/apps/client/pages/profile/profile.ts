import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../../services/client.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class ClientProfileComponent implements OnInit {
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
  loading = true;

  constructor(private readonly clientService: ClientService) {}

  ngOnInit(): void {
    void this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.loading = true;
    try {
      const p = await this.clientService.getMyProfile();
      this.profile = {
        ...this.profile,
        name: p.name || 'Client',
        email: p.email || '',
        phone: p.phone || '',
        address: p.address || '',
        profile_image: p.profile_image || '',
      };
    } catch (err) {
      alert(ClientService.errorMessage(err));
    } finally {
      this.loading = false;
    }
  }

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

  async handleUpdateProfile(): Promise<void> {
    this.loading = true;
    try {
      await this.clientService.updateMyProfile({
        name: this.profile.name,
        phone: this.profile.phone,
        address: this.profile.address,
        profile_image: this.profile.profile_image,
      });

      this.isEditing = false;
      alert('Profile updated successfully!');
    } catch (err) {
      alert(ClientService.errorMessage(err));
    } finally {
      this.loading = false;
    }
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

