import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClientService } from '../../../../services/client.service';
import { WorkerService } from '../../../../services/worker.service';

type AvailabilityEntry = { day_of_week: number | string; is_available: boolean };

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-profile.html',
})
export class StaffProfileComponent implements OnInit {
  defaultClientAvatar = 'https://via.placeholder.com/128';
  defaultWorkerAvatar = 'https://via.placeholder.com/256';

  id: string | null = null;
  worker: any = null;
  loading = false;
  error: string | null = null;
  saveError: string | null = null;
  saveSuccess = false;
  currentMonth = new Date();
  saving = false;

  days: Array<Date | null> = [];
  stars = [0, 1, 2, 3, 4];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private readonly workerService: WorkerService,
    private readonly clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    void this.loadWorker();
  }

  private async loadWorker(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.saveError = null;
    this.saveSuccess = false;
    this.worker = null;

    const workerId = this.id ? Number(this.id) : NaN;
    if (!workerId || Number.isNaN(workerId)) {
      this.loading = false;
      this.error = 'Invalid worker id';
      return;
    }

    try {
      const p = await this.workerService.getWorkerProfile(workerId);
      this.worker = {
        id: this.id,
        name: p?.name,
        role: p?.role,
        rating: p?.rating,
        rating_count: p?.rating_count,
        description: p?.description,
        about: p?.description,
        skills: Array.isArray(p?.skills) ? (p.skills as string[]).map((s) => ({ skill_name: s })) : [],
        reviews: (p as any)?.reviews || [],
        availability: p?.availability,
        booked_dates: (p as any)?.booked_dates || [],
        image_url: p?.image_url || this.defaultWorkerAvatar,
        hourly_rate: p?.hourly_rate,
        total_jobs_completed: p?.completed_jobs ?? 0,
      };
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
      this.worker = null;
    } finally {
      this.loading = false;
      this.rebuildCalendar();
    }
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.rebuildCalendar();
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.rebuildCalendar();
  }

  rebuildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: Array<Date | null> = [];

    for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(new Date(year, month, i));

    this.days = arr;
  }

  isDateBooked(date: Date): boolean {
    if (!this.worker?.booked_dates) return false;
    const dateString = date.toISOString().split('T')[0];
    return (this.worker.booked_dates as string[]).some((d) => d.startsWith(dateString));
  }

  isDateAvailable(date: Date): boolean {
    const availability = this.worker?.availability;
    if (!availability) return false;

    if (Array.isArray(availability)) {
      const dayOfWeek = date.getDay(); // 0-6
      const availEntry = (availability as AvailabilityEntry[]).find(
        (a) => a.day_of_week === dayOfWeek || a.day_of_week === String(dayOfWeek),
      );
      return !!(availEntry && availEntry.is_available);
    }

    // Backend stores availability as an object keyed by day names (e.g., "Monday").
    if (typeof availability === 'object') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
      const dayName = dayNames[date.getDay()];
      const entry = (availability as Record<string, { start?: string; end?: string }>)[dayName];
      return !!(entry && (entry.start || entry.end));
    }

    return false;
  }

  dayClass(date: Date): string {
    const booked = this.isDateBooked(date);
    const available = !booked && this.isDateAvailable(date);

    let className = 'py-1 flex items-center justify-center rounded-full size-8 mx-auto relative';
    if (booked) {
      className += ' bg-red-100 text-red-600 font-bold';
    } else if (available) {
      className += ' bg-primary/10 text-primary font-bold';
    } else {
      className += ' text-gray-400 dark:text-gray-600';
    }
    return className;
  }

  dayTitle(date: Date): string {
    const booked = this.isDateBooked(date);
    const available = !booked && this.isDateAvailable(date);
    return booked ? 'Booked' : available ? 'Available' : 'Not Available';
  }

  monthLabel(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  formatRating(value: any): string {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  }

  formatDate(value: any): string {
    if (!value) return 'Recent';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString();
  }

  async handleAddToSaved(): Promise<void> {
    if (!this.worker) return;
    if (!confirm('Save this worker to your list?')) return;

    this.saveError = null;
    this.saveSuccess = false;
    this.saving = true;
    try {
      const workerId = Number(this.worker.id);
      await this.clientService.saveWorker(workerId);
      this.saveSuccess = true;
      setTimeout(() => (this.saveSuccess = false), 2000);
    } catch (err) {
      this.saveError = ClientService.errorMessage(err);
    } finally {
      this.saving = false;
    }
  }
}

