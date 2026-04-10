import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AdminBookingRow, AdminService } from '../../../../services/admin.service';

type ReviewRow = {
  id: number;
  client: string;
  worker: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
};

type BookingOption = {
  id: number;
  client_name: string;
  service_name: string;
  client_id: number;
  worker_id: number;
};

@Component({
  selector: 'app-admin-ratings-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ratings-reviews.html',
})
export class AdminRatingsReviewsComponent implements OnInit {
  filter = 'all';
  searchTerm = '';
  reviews: ReviewRow[] = [];
  bookingOptions: BookingOption[] = [];
  loading = false;
  error = '';
  saving = false;

  showModal = false;
  newReview: { bookingId: string; rating: number; comment: string } = { bookingId: '', rating: 5, comment: '' };
  formError = '';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      reviews: this.adminService.getReviews(),
      bookings: this.adminService.getBookings(),
    }).subscribe({
      next: ({ reviews, bookings }) => {
        this.reviews = reviews.map((r) => ({
          id: r.id,
          client: r.client_name || 'Client',
          worker: r.worker_name || '',
          service: r.service_name || 'Service',
          rating: Number(r.rating) || 0,
          comment: r.comment || '',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
          status: 'Published',
        }));
        this.bookingOptions = bookings
          .filter((b) => (b.status || '').toLowerCase() === 'completed')
          .map((b: AdminBookingRow) => ({
            id: b.id,
            client_name: b.client_name || `Client #${b.client_id}`,
            service_name: b.service_name || `Service #${b.service_id}`,
            client_id: Number(b.client_id),
            worker_id: Number(b.worker_id),
          }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get averageRating(): string {
    return this.reviews && this.reviews.length > 0
      ? (this.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / this.reviews.length).toFixed(1)
      : '0.0';
  }

  get averageRatingRounded(): number {
    const v = Number(this.averageRating) || 0;
    return Math.round(v);
  }

  countByRating(stars: number): number {
    return (this.reviews || []).filter((r) => r.rating === stars).length;
  }

  get filteredReviews(): ReviewRow[] {
    return (this.reviews || []).filter((review) => {
      const matchesSearch =
        (review.client || '').toLowerCase().includes((this.searchTerm || '').toLowerCase()) ||
        (review.service || '').toLowerCase().includes((this.searchTerm || '').toLowerCase()) ||
        (review.comment || '').toLowerCase().includes((this.searchTerm || '').toLowerCase()) ||
        (review.worker || '').toLowerCase().includes((this.searchTerm || '').toLowerCase());

      const matchesFilter =
        this.filter === 'all' ||
        (this.filter === 'published' && review.status === 'Published') ||
        (this.filter === 'pending' && review.status === 'Pending') ||
        (this.filter === 'high' && review.rating >= 4) ||
        (this.filter === 'low' && review.rating <= 2);

      return matchesSearch && matchesFilter;
    });
  }

  stars(): number[] {
    return [0, 1, 2, 3, 4];
  }

  starChar(i: number, rating: number): string {
    const safe = Number(rating) || 0;
    return i < safe ? '⭐' : '☆';
  }

  handleCreateReview(e: Event): void {
    e.preventDefault();
    this.formError = '';
    const bookingId = parseInt(this.newReview.bookingId, 10);
    if (!bookingId) {
      this.formError = 'Select a booking';
      return;
    }
    const selectedBooking = this.bookingOptions.find((b) => b.id === bookingId);
    if (!selectedBooking || !selectedBooking.client_id || !selectedBooking.worker_id) {
      this.formError = 'Invalid booking selection';
      return;
    }
    this.saving = true;
    this.adminService
      .postReview({
        booking_id: bookingId,
        client_id: selectedBooking.client_id,
        worker_id: selectedBooking.worker_id,
        rating: Number(this.newReview.rating) || 5,
        comment: this.newReview.comment?.trim() || '',
      })
      .subscribe({
        next: () => {
          this.showModal = false;
          this.newReview = { bookingId: '', rating: 5, comment: '' };
          this.saving = false;
          this.reload();
        },
        error: (err) => {
          this.formError = AdminService.errorMessage(err);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  handleApprove(_id: number): void {
    // Reviews are live once stored; moderation not modeled in API.
  }

  handleReject(id: number): void {
    this.handleDelete(id);
  }

  handleDelete(id: number): void {
    if (!confirm('Delete this review?')) return;
    this.error = '';
    this.adminService.deleteReview(id).subscribe({
      next: () => this.reload(),
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  handleEdit(_id: number): void {
    // Update not exposed on admin API; delete and re-create if needed.
  }

  handleAddReview(): void {
    this.formError = '';
    this.showModal = true;
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}
