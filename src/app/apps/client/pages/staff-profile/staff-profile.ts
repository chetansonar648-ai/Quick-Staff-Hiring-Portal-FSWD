import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  currentMonth = new Date();
  saving = false;

  days: Array<Date | null> = [];
  stars = [0, 1, 2, 3, 4];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    // No backend: mock worker
    this.worker = {
      id: this.id || '1',
      name: 'Ava Johnson',
      role: 'Cleaning',
      rating: 4.9,
      rating_count: 124,
      description: 'Reliable and detail-oriented with strong communication and punctuality.',
      about: '',
      skills: [{ skill_name: 'Deep cleaning' }, { skill_name: 'Move-out cleaning' }, { skill_name: 'Laundry' }],
      reviews: [
        {
          client_name: 'Jordan',
          client_image: this.defaultClientAvatar,
          created_at: '2026-02-11',
          rating: 5,
          comment: 'Excellent service. Very professional and thorough.',
        },
        {
          client_name: 'Sam',
          client_image: this.defaultClientAvatar,
          created_at: '2026-01-22',
          rating: 4,
          comment: 'Great job overall. Would book again.',
        },
      ],
      availability: [
        { day_of_week: 1, is_available: true },
        { day_of_week: 2, is_available: true },
        { day_of_week: 3, is_available: true },
        { day_of_week: 4, is_available: true },
        { day_of_week: 5, is_available: true },
      ] as AvailabilityEntry[],
      booked_dates: ['2026-03-08', '2026-03-18'],
      image_url: this.defaultWorkerAvatar,
      hourly_rate: 25,
      total_jobs_completed: 31,
    };

    this.rebuildCalendar();
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
    if (!availability || !Array.isArray(availability)) return false;
    const dayOfWeek = date.getDay(); // 0-6
    const availEntry = (availability as AvailabilityEntry[]).find(
      (a) => a.day_of_week === dayOfWeek || a.day_of_week === String(dayOfWeek),
    );
    return !!(availEntry && availEntry.is_available);
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

  handleAddToSaved(): void {
    if (!this.worker) return;
    if (!confirm('Save this worker to your list?')) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      alert('Worker saved successfully!');
    }, 300);
  }
}

