import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { WorkerService, type WorkerProfileApi } from '../../../services/worker.service';

type Availability = Record<string, { start?: string; end?: string }>;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

@Component({
  selector: 'app-worker-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class WorkerProfileComponent implements OnInit {
  days = days;

  loading = true;
  saving = false;
  error: string | null = null;
  success = false;
  serviceNames: string[] = ['House Cleaning', 'Plumbing', 'Electrical Repair', 'Gardening & Landscaping', 'Handyman Services', 'Painting', 'Moving Services', 'Other'];

  uploading = false;

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  // Password modal state
  showPasswordModal = false;
  passwordForm = { current_password: '', new_password: '', confirm_password: '' };
  passwordError = '';
  passwordSuccess = false;
  changingPassword = false;

  profile: {
    name: string;
    email: string;
    phone: string;
    title: string;
    years_of_experience: string;
    bio: string;
    address: string;
    service_location: string;
    skills: string[];
    hourly_rate: string;
    availability: Availability;
    rating: number;
    total_reviews: number;
    completed_jobs: number;
    profile_picture: string;
  } = {
    name: 'Kenil Patel',
    email: 'kenil@example.com',
    phone: '',
    title: '',
    years_of_experience: '',
    bio: '',
    address: '',
    service_location: '',
    skills: ['Cleaning', 'Gardening'],
    hourly_rate: '25',
    availability: {},
    rating: 4.8,
    total_reviews: 12,
    completed_jobs: 7,
    profile_picture: '',
  };

  skillInput = '';

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    void this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.success = false;
    try {
      const p = await this.workerService.getMyProfile();
      this.applyProfileFromApi(p);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
    } finally {
      this.loading = false;
    }
  }

  private applyProfileFromApi(p: WorkerProfileApi | null | undefined): void {
    this.profile = {
      name: p?.name || '',
      email: p?.email || '',
      phone: p?.phone || '',
      title: p?.role || '',
      years_of_experience: p?.years_of_experience != null ? String(p.years_of_experience) : '',
      bio: p?.description || '',
      address: p?.address || '',
      service_location: p?.service_location || p?.location || '',
      skills: Array.isArray(p?.skills) ? (p?.skills as string[]) : [],
      hourly_rate: p?.hourly_rate != null ? String(p.hourly_rate) : '',
      availability: (p?.availability as Availability) || {},
      rating: p?.rating ?? 0,
      total_reviews: p?.rating_count ?? 0,
      completed_jobs: p?.completed_jobs ?? 0,
      profile_picture: p?.image_url || '',
    };
  }

  updateField(field: keyof WorkerProfileComponent['profile'], value: any): void {
    (this.profile as any)[field] = value;
  }

  addSkill(): void {
    if (!this.skillInput.trim()) return;
    if (this.profile.skills.includes(this.skillInput.trim())) return;
    this.updateField('skills', [...this.profile.skills, this.skillInput.trim()]);
    this.skillInput = '';
  }

  removeSkill(skill: string): void {
    this.updateField('skills', this.profile.skills.filter((s) => s !== skill));
  }

  updateAvailability(day: string, field: 'start' | 'end', value: string): void {
    this.updateField('availability', {
      ...this.profile.availability,
      [day]: { ...(this.profile.availability?.[day] || {}), [field]: value },
    });
  }

  private timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(\s?(AM|PM))?$/i;

  private validateAvailabilityData(): string | null {
    for (const day of days) {
      const times = this.profile.availability?.[day];
      if (!times) continue;
      const { start, end } = times;
      if (!start && !end) continue;
      if ((start && !end) || (!start && end)) {
        return `${day} must have both start and end times, or leave both empty`;
      }
      if (start && !this.timeRegex.test(start)) {
        return `Invalid start time for ${day}. Use format like "09:00 AM" or "09:00"`;
      }
      if (end && !this.timeRegex.test(end)) {
        return `Invalid end time for ${day}. Use format like "05:00 PM" or "17:00"`;
      }
    }
    return null;
  }

  async saveChanges(): Promise<void> {
    const validationError = this.validateAvailabilityData();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = false;

    try {
      const hourlyRate = this.profile.hourly_rate ? parseFloat(this.profile.hourly_rate) : undefined;
      const years = this.profile.years_of_experience ? parseInt(this.profile.years_of_experience, 10) : undefined;

      await this.workerService.updateMyProfile({
        name: this.profile.name,
        phone: this.profile.phone || '',
        bio: this.profile.bio,
        skills: this.profile.skills,
        hourly_rate: hourlyRate,
        availability: this.profile.availability,
        title: this.profile.title,
        years_of_experience: years,
        address: this.profile.address,
        service_location: this.profile.service_location,
      });

      this.success = true;
      setTimeout(() => (this.success = false), 3000);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
    } finally {
      this.saving = false;
    }
  }

  triggerFileSelect(): void {
    this.fileInputRef?.nativeElement.click();
  }

  async handleProfilePictureUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.error = null;

    // Preview instantly for better UX.
    const url = URL.createObjectURL(file);
    this.updateField('profile_picture', url);

    try {
      const res = await this.workerService.uploadProfilePicture(file);
      this.updateField('profile_picture', res.profile_image);

      this.success = true;
      setTimeout(() => (this.success = false), 3000);
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
    } finally {
      this.uploading = false;
    }
  }

  async handlePasswordChange(): Promise<void> {
    this.passwordError = '';
    this.passwordSuccess = false;

    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.passwordError = 'New passwords do not match';
      return;
    }
    if (this.passwordForm.new_password.length < 6) {
      this.passwordError = 'New password must be at least 6 characters';
      return;
    }

    this.changingPassword = true;

    // No backend: simulate change.
    this.passwordSuccess = true;
    this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
    setTimeout(() => {
      this.showPasswordModal = false;
      this.passwordSuccess = false;
    }, 2000);

    this.changingPassword = false;
  }

  getInitials(name: string): string {
    if (!name) return 'W';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getProfilePictureUrl(): string | null {
    if (this.profile.profile_picture) {
      if (this.profile.profile_picture.startsWith('/uploads')) {
        return `${environment.apiBaseUrl}${this.profile.profile_picture}`;
      }
      return this.profile.profile_picture;
    }
    return null;
  }
}

