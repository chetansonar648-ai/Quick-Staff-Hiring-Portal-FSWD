import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { from } from 'rxjs';

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
    name: '',
    email: '',
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
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.profileError = null;
    this.profileSuccess = false;
    this.clientService.getClientProfile()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (p) => {
          this.profile = {
            name: p.name || '',
            email: p.email || '',
            phone: p.phone || '',
            address: p.address || '',
            profile_image: p.profile_image || '',
          };
          this.profileError = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.profileError = ClientService.errorMessage(err);
          this.cdr.detectChanges();
        },
      });
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
    from(this.authService.changePassword(this.passwordForm.current_password, this.passwordForm.new_password))
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
          this.passwordSuccess = true;
          setTimeout(() => (this.passwordSuccess = false), 2000);
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          this.passwordError = AuthService.errorMessage(err);
          this.cdr.detectChanges();
        },
      });
  }

  getProfileImageUrl(): string {
    return this.profile.profile_image || this.defaultClientAvatar;
  }
}

