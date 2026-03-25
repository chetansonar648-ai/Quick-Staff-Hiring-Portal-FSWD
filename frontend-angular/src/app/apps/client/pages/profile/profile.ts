import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';

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
  passwordError: string | null = null;
  passwordSuccess = false;
  profileError: string | null = null;
  profileSuccess = false;

  constructor(
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    void this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.loading = true;
    this.profileError = null;
    this.profileSuccess = false;
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
      this.profileError = ClientService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  openChangePhotoPrompt(): void {
    if (!this.isEditing) {
      this.profileError = "Please click 'Edit Profile' first.";
      return;
    }
    const url = prompt('Enter new profile image URL:', this.profile.profile_image || this.defaultClientAvatar);
    if (url) {
      this.profile = { ...this.profile, profile_image: url };
    }
  }

  async handleUpdateProfile(): Promise<void> {
    this.loading = true;
    this.profileError = null;
    this.profileSuccess = false;
    try {
      await this.clientService.updateMyProfile({
        name: this.profile.name,
        phone: this.profile.phone,
        address: this.profile.address,
        profile_image: this.profile.profile_image,
      });

      this.isEditing = false;
      this.profileSuccess = true;
    } catch (err) {
      this.profileError = ClientService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  handleChangePassword(): void {
    this.passwordError = null;
    this.passwordSuccess = false;

    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.passwordError = 'New passwords do not match';
      return;
    }
    if (!this.passwordForm.new_password || this.passwordForm.new_password.length < 6) {
      this.passwordError = 'New password must be at least 6 characters';
      return;
    }

    this.loading = true;
    void this.authService
      .changePassword(this.passwordForm.current_password, this.passwordForm.new_password)
      .then(() => {
        this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
        this.passwordSuccess = true;
        setTimeout(() => (this.passwordSuccess = false), 2000);
      })
      .catch((err) => {
        this.passwordError = AuthService.errorMessage(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getProfileImageUrl(): string {
    return this.profile.profile_image || this.defaultClientAvatar;
  }
}

