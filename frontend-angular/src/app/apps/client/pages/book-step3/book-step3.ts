import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize, from } from 'rxjs';

import { ClientService } from '../../../../services/client.service';
import { WorkerProfileApi } from '../../../../services/worker.service';

@Component({
  selector: 'app-book-step3',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-step3.html',
})
export class BookStep3Component implements OnInit {
  defaultWorkerAvatar = 'https://via.placeholder.com/150';
  worker: WorkerProfileApi | null = null;
  service: unknown = null;
  date = '';
  time = '';
  serviceLocation = '';
  duration = '';
  instructions = '';
  formattedDate = '';
  bookingInstructions = 'None provided';
  isSubmitting = false;

  constructor(
    public readonly router: Router,
    private readonly clientService: ClientService,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const state = ((this.router.getCurrentNavigation()?.extras.state ?? history.state) || {}) as {
      worker?: WorkerProfileApi;
      service?: unknown;
      date?: string;
      time?: string;
      location?: string;
      duration?: string;
      instructions?: string;
    };

    this.worker = state.worker || null;
    this.service = state.service ?? null;
    this.date = state.date || '';
    this.time = state.time || '';
    this.serviceLocation = state.location || '';
    this.duration = state.duration || '4';
    this.instructions = state.instructions || '';

    if (!this.worker || !this.date || !this.time) {
      this.router.navigate(['/client/browse-staff']);
      return;
    }

    this.formattedDate =
      new Date(this.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ` at ${this.time}`;
    this.bookingInstructions = this.instructions || 'None provided';
  }

  get hourlyRate(): number {
    return Number(this.worker?.hourly_rate || 25);
  }

  get bookingDuration(): number {
    return parseInt(this.duration || '4', 10);
  }

  get subtotal(): number {
    return this.hourlyRate * this.bookingDuration;
  }

  onWorkerImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = this.defaultWorkerAvatar;
  }

  handleConfirm(): void {
    if (!this.worker) return;
    this.isSubmitting = true;

    try {
      let time24 = this.time;
      if (this.time && (this.time.includes('AM') || this.time.includes('PM'))) {
        const [timePart, modifier] = this.time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
        time24 = `${hours}:${minutes}:00`;
      } else if (this.time && this.time.split(':').length === 2) {
        time24 = `${this.time}:00`;
      }

      const bookingDateTime = new Date(`${this.date}T${time24}`);
      if (Number.isNaN(bookingDateTime.getTime())) {
        throw new Error(`Invalid Date/Time: ${this.date} ${this.time} (Parsed: ${this.date}T${time24})`);
      }

      from(
        this.clientService.createBooking({
          worker_id: Number(this.worker.id),
          service_id: null,
          booking_date: bookingDateTime.toISOString(),
          duration_hours: this.bookingDuration,
          total_price: this.subtotal,
          address: this.serviceLocation,
          special_instructions: this.bookingInstructions !== 'None provided' ? this.bookingInstructions : null,
        }),
      )
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (data) => {
            this.router.navigate(['/client/book/confirm'], {
              state: {
                worker: this.worker,
                serviceLocation: this.serviceLocation,
                total: this.subtotal.toFixed(2),
                formattedDate: this.formattedDate,
                bookingReference: data.booking?.id || data.booking_reference,
              },
            });
          },
          error: (err) => {
            alert(`Booking failed: ${ClientService.errorMessage(err)}`);
          },
        });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Network/Client Error: ${msg}`);
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    this.location.back();
  }
}

