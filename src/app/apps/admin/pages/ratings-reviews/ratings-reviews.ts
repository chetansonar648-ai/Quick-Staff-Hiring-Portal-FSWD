import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ReviewRow = {
  id: number;
  client: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
};

@Component({
  selector: 'app-admin-ratings-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ratings-reviews.html',
})
export class AdminRatingsReviewsComponent {
  filter = 'all';
  searchTerm = '';

  reviews: ReviewRow[] = [
    { id: 1, client: 'John Doe', service: 'Cleaning', rating: 5, comment: 'Great job!', date: new Date().toLocaleDateString(), status: 'Published' },
    { id: 2, client: 'Jane Smith', service: 'Moving', rating: 4, comment: 'On time and helpful.', date: new Date().toLocaleDateString(), status: 'Published' },
  ];
  bookings: any[] = [
    { id: 101, client_name: 'John Doe', service_name: 'Cleaning', client_id: 1, worker_id: 1 },
  ];
  loading = false;

  showModal = false;
  newReview: any = { bookingId: '', rating: 5, comment: '' };
  formError = '';

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
        (review.comment || '').toLowerCase().includes((this.searchTerm || '').toLowerCase());

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
    if (!this.newReview.bookingId) {
      this.formError = 'Select a booking';
      return;
    }
    const selectedBooking = this.bookings.find((b) => b.id === parseInt(this.newReview.bookingId, 10));
    if (!selectedBooking) return;

    const newId = Math.max(0, ...this.reviews.map((r) => r.id)) + 1;
    this.reviews = [
      ...this.reviews,
      {
        id: newId,
        client: selectedBooking.client_name || `User #${selectedBooking.client_id}`,
        service: selectedBooking.service_name || 'Service',
        rating: parseInt(String(this.newReview.rating), 10),
        comment: this.newReview.comment,
        date: new Date().toLocaleDateString(),
        status: 'Published',
      },
    ];

    this.showModal = false;
    this.newReview = { bookingId: '', rating: 5, comment: '' };
  }

  handleApprove(id: number): void {
    // Mock action: no API wired yet.
  }

  handleReject(id: number): void {
    if (!confirm('Are you sure you want to reject/delete this review?')) return;
    this.reviews = this.reviews.filter((r) => r.id !== id);
  }

  handleDelete(id: number): void {
    this.handleReject(id);
  }

  handleEdit(id: number): void {
    // Mock action: no API wired yet.
  }

  handleAddReview(): void {
    this.showModal = true;
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}

