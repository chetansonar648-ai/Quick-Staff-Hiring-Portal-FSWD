import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize, from } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { ClientBookingApi, ClientService } from '../../../../services/client.service';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Booking = {
  id: number;
  worker_id?: number;
  service_id?: number;
  worker_name: string;
  worker_role?: string;
  worker_image?: string;
  worker_rating?: number;
  service_type: string;
  service_description?: string;
  status: string;
  booking_date: string; // yyyy-mm-dd
  start_time: string; // HH:MM
  end_time?: string;
  duration_hours?: number;
  location_address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  booking_reference?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
};

const tabs = [
  { key: 'upcoming', label: 'Upcoming Bookings', icon: 'event_upcoming' },
  { key: 'active', label: 'Active Bookings', icon: 'work' },
  { key: 'requested', label: 'Requested Bookings', icon: 'hourglass_top' },
  { key: 'past', label: 'Past Bookings', icon: 'history' },
  { key: 'completed', label: 'Completed Jobs', icon: 'task_alt' },
  { key: 'cancelled', label: 'Cancelled Jobs', icon: 'cancel' },
  { key: 'pendingReviews', label: 'Pending Reviews', icon: 'rate_review' },
] as const;

@Component({
  selector: 'app-client-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.html',
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  defaultWorkerAvatar = 'https://via.placeholder.com/150';

  tabs = tabs;
  activeTab: string = 'upcoming';

  bookings: Record<string, Booking[]> = {};
  loading = false;
  error: string | null = null;

  toasts: Array<{ id: number; message: string; type: ToastType }> = [];

  // Upcoming section state
  upcomingSearchTerm = '';
  upcomingSortOption = 'Date (Soonest)';
  upcomingMonthOffset = 0;
  upcomingSelectedDate: string | null = null;
  upcomingViewBooking: Booking | null = null;
  upcomingRescheduleBooking: Booking | null = null;

  // Active section state
  activeSearchTerm = '';
  activeViewBooking: Booking | null = null;
  activeRescheduleBooking: Booking | null = null;

  // Requested section state
  requestedSearchTerm = '';
  requestedFilterService = 'All Services';
  requestedFilterStatus = 'Any Status';
  requestedFilterDate = '';
  requestedViewBooking: Booking | null = null;

  // Past section state
  pastSearchTerm = '';
  pastViewBooking: Booking | null = null;

  // Completed section state
  completedSearchTerm = '';
  completedViewBooking: Booking | null = null;

  // Cancelled section state
  cancelledSearchTerm = '';
  cancelledViewBooking: Booking | null = null;

  // Pending reviews section state
  pendingViewBooking: Booking | null = null;
  reviewBooking: Booking | null = null;

  // Reschedule modal state
  rescheduleDate = '';
  rescheduleTime = '';
  rescheduleLoading = false;
  rescheduleTarget: Booking | null = null;

  // Review modal state
  reviewRating = 0;
  reviewComment = '';
  reviewLoading = false;
  reviewStars = [1, 2, 3, 4, 5];

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.sub = this.route.queryParamMap.subscribe((params) => {
      this.activeTab = params.get('tab') || 'upcoming';
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  setActiveTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: tabKey }, queryParamsHandling: 'merge' });
  }

  addToast(message: string, type: ToastType = 'success'): void {
    const id = Date.now();
    this.toasts = [...this.toasts, { id, message, type }];
    setTimeout(() => this.removeToast(id), 3000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  private loadBookings(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.error = 'Unable to find logged-in client session. Please login again.';
      this.bookings = this.emptyBookings();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;

    from(this.clientService.getClientBookings())
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (rows) => {
          const mapped = (rows || []).map((b) => this.mapApiBooking(b));
          this.bookings = this.groupBookings(mapped);
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.bookings = this.emptyBookings();
          this.cdr.detectChanges();
        },
      });
  }

  private mapApiBooking(b: ClientBookingApi): Booking {
    return {
      id: Number(b.id ?? 0),
      worker_id: b.worker_id,
      service_id: b.service_id,
      worker_name: b.worker_name || 'Worker',
      worker_role: b.worker_role || '',
      worker_image: b.worker_image || this.defaultWorkerAvatar,
      worker_rating: Number(b.worker_rating ?? 0),
      service_type: b.service_type || 'General Service',
      service_description: b.service_description || '',
      status: b.status || 'pending',
      booking_date: b.booking_date || '',
      start_time: b.start_time || '',
      end_time: b.end_time || '',
      duration_hours: b.duration_hours,
      location_address: b.location_address || b.address || '',
      city: b.city || '',
      state: b.state || '',
      zip_code: b.zip_code || '',
      booking_reference: b.booking_reference || `BK-${b.id ?? ''}`,
      cancelled_at: b.cancelled_at || '',
      cancelled_by: b.cancelled_by || '',
      cancellation_reason: b.cancellation_reason || '',
    };
  }

  private groupBookings(base: Booking[]): Record<string, Booking[]> {
    return {
      upcoming: base.filter((b) => ['pending', 'accepted'].includes(b.status) || b.booking_date >= this.today()),
      active: base.filter((b) => b.status === 'in_progress'),
      requested: base.filter((b) => b.status === 'pending' || b.status === 'reviewing'),
      past: base.filter((b) => b.status === 'completed' || b.status === 'cancelled'),
      completed: base.filter((b) => b.status === 'completed'),
      cancelled: base.filter((b) => b.status === 'cancelled'),
      pendingReviews: base.filter((b) => b.status === 'completed'),
    };
  }

  private emptyBookings(): Record<string, Booking[]> {
    return {
      upcoming: [],
      active: [],
      requested: [],
      past: [],
      completed: [],
      cancelled: [],
      pendingReviews: [],
    };
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Shared helpers copied from React logic
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-orange-500 bg-orange-500/10';
      case 'accepted':
        return 'text-green-500 bg-green-500/10';
      case 'in_progress':
        return 'text-blue-500 bg-blue-500/10';
      case 'completed':
        return 'text-gray-500 bg-gray-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  }

  formatShortDate(date: string): string {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  }

  formatLongDate(date: string): string {
    const d = new Date(date);
    return Number.isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatToDateString(date: string): string {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? '' : d.toDateString();
  }

  // Upcoming section computed values
  get upcomingCurrentDate(): Date {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + this.upcomingMonthOffset);
    return currentDate;
  }

  get upcomingCurrentMonthName(): string {
    return this.upcomingCurrentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  get upcomingCalendarDays(): number[] {
    const d = this.upcomingCurrentDate;
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const arr: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }

  hasBookingOnDate(dateStr: string): boolean {
    const list = this.bookings['upcoming'] || [];
    return list.some((b) => (b.booking_date || '').startsWith(dateStr));
  }

  getDayDetails(day: number): { className: string; dateStr: string; hasBooking: boolean } {
    const d = this.upcomingCurrentDate;
    const dateStr = new Date(d.getFullYear(), d.getMonth(), day).toISOString().split('T')[0];
    const isSelected = this.upcomingSelectedDate === dateStr;
    const hasBooking = this.hasBookingOnDate(dateStr);

    let className = 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative';

    if (isSelected) {
      className = 'bg-primary text-white font-bold rounded-lg cursor-pointer shadow-md transform scale-105 transition-all';
    } else if (hasBooking) {
      className = 'bg-primary/10 text-primary font-semibold rounded-lg cursor-pointer hover:bg-primary/20';
    }

    return { className, dateStr, hasBooking };
  }

  handleDayClick(day: number): void {
    const d = this.upcomingCurrentDate;
    const dateStr = new Date(d.getFullYear(), d.getMonth(), day).toISOString().split('T')[0];
    if (this.upcomingSelectedDate === dateStr) {
      this.upcomingSelectedDate = null;
    } else {
      this.upcomingSelectedDate = dateStr;
    }
  }

  get upcomingFilteredBookings(): Booking[] {
    const bookings = this.bookings['upcoming'] || [];
    let result = bookings.filter((b) => {
      const searchLower = (this.upcomingSearchTerm || '').toLowerCase();
      const matchesSearch =
        (b.worker_name || '').toLowerCase().includes(searchLower) ||
        (b.service_type || '').toLowerCase().includes(searchLower) ||
        (b.status || '').toLowerCase().includes(searchLower);

      let matchesDate = true;
      if (this.upcomingSelectedDate) {
        matchesDate = (b.booking_date || '').startsWith(this.upcomingSelectedDate);
      }

      return matchesSearch && matchesDate;
    });

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.booking_date + 'T' + a.start_time).getTime();
      const dateB = new Date(b.booking_date + 'T' + b.start_time).getTime();
      if (this.upcomingSortOption === 'Date (Latest)') return dateB - dateA;
      if (this.upcomingSortOption === 'Status') return (a.status || '').localeCompare(b.status || '');
      return dateA - dateB;
    });

    return result;
  }

  // Active section computed
  get activeFilteredBookings(): Booking[] {
    const bookings = this.bookings['active'] || [];
    if (!this.activeSearchTerm) return bookings;
    const lowerTerm = this.activeSearchTerm.toLowerCase();
    return bookings.filter((b) => {
      return (
        (b.worker_name || '').toLowerCase().includes(lowerTerm) ||
        (b.service_type || '').toLowerCase().includes(lowerTerm) ||
        (b.location_address || '').toLowerCase().includes(lowerTerm)
      );
    });
  }

  // Requested computed
  get requestedServices(): string[] {
    const bookings = this.bookings['requested'] || [];
    const set = new Set<string>();
    bookings.forEach((b) => set.add(b.service_type));
    return ['All Services', ...Array.from(set)];
  }

  get requestedFilteredBookings(): Booking[] {
    const bookings = this.bookings['requested'] || [];
    return bookings.filter((b) => {
      const searchLower = (this.requestedSearchTerm || '').toLowerCase();
      const matchesSearch =
        (b.worker_name || '').toLowerCase().includes(searchLower) || (b.service_type || '').toLowerCase().includes(searchLower);

      let matchesService = true;
      if (this.requestedFilterService !== 'All Services') {
        matchesService = b.service_type === this.requestedFilterService;
      }

      let matchesStatus = true;
      if (this.requestedFilterStatus !== 'Any Status') {
        if (this.requestedFilterStatus === 'Pending') matchesStatus = b.status === 'pending';
        if (this.requestedFilterStatus === 'Worker Reviewing') matchesStatus = b.status === 'reviewing';
      }

      let matchesDate = true;
      if (this.requestedFilterDate) {
        matchesDate = (b.booking_date || '').startsWith(this.requestedFilterDate);
      }

      return matchesSearch && matchesService && matchesStatus && matchesDate;
    });
  }

  getRequestedStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-orange-500 bg-orange-500/10';
      case 'reviewing':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  }

  // Past computed
  get pastFilteredBookings(): Booking[] {
    const bookings = this.bookings['past'] || [];
    if (!this.pastSearchTerm) return bookings;
    const lowerTerm = this.pastSearchTerm.toLowerCase();
    return bookings.filter((b) => {
      return (
        (b.worker_name || '').toLowerCase().includes(lowerTerm) ||
        (b.service_type || '').toLowerCase().includes(lowerTerm) ||
        (b.location_address || '').toLowerCase().includes(lowerTerm)
      );
    });
  }

  getPastStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-gray-500 bg-gray-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  }

  // Completed computed
  get completedFilteredBookings(): Booking[] {
    const bookings = this.bookings['completed'] || [];
    if (!this.completedSearchTerm) return bookings;
    const lowerTerm = this.completedSearchTerm.toLowerCase();
    return bookings.filter((b) => {
      return (
        (b.worker_name || '').toLowerCase().includes(lowerTerm) ||
        (b.service_type || '').toLowerCase().includes(lowerTerm) ||
        (b.location_address || '').toLowerCase().includes(lowerTerm)
      );
    });
  }

  // Cancelled computed
  get cancelledFilteredBookings(): Booking[] {
    const bookings = this.bookings['cancelled'] || [];
    if (!this.cancelledSearchTerm) return bookings;
    const lowerTerm = this.cancelledSearchTerm.toLowerCase();
    return bookings.filter((b) => {
      return (
        (b.worker_name || '').toLowerCase().includes(lowerTerm) ||
        (b.service_type || '').toLowerCase().includes(lowerTerm) ||
        ((b.cancellation_reason || '').toLowerCase().includes(lowerTerm))
      );
    });
  }

  // Actions (mock only)
  handleCancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const all = Object.keys(this.bookings);
      all.forEach((k) => {
        this.bookings[k] = (this.bookings[k] || []).map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: 'cancelled',
            cancelled_by: 'client',
            cancellation_reason: 'User requested cancellation',
            cancelled_at: this.today(),
          };
        });
      });
      this.addToast('Booking cancelled', 'info');
    }
  }

  handleWithdraw(bookingId: number): void {
    if (confirm('Are you sure you want to withdraw this booking request?')) {
      this.handleCancelBooking(bookingId);
    }
  }

  openViewModal(booking: Booking): void {
    // Used by several sections; store in the correct variable based on active tab.
    if (this.activeTab === 'upcoming') this.upcomingViewBooking = booking;
    else if (this.activeTab === 'active') this.activeViewBooking = booking;
    else if (this.activeTab === 'requested') this.requestedViewBooking = booking;
    else if (this.activeTab === 'past') this.pastViewBooking = booking;
    else if (this.activeTab === 'completed') this.completedViewBooking = booking;
    else if (this.activeTab === 'cancelled') this.cancelledViewBooking = booking;
    else if (this.activeTab === 'pendingReviews') this.pendingViewBooking = booking;
  }

  closeAllViewModals(): void {
    this.upcomingViewBooking = null;
    this.activeViewBooking = null;
    this.requestedViewBooking = null;
    this.pastViewBooking = null;
    this.completedViewBooking = null;
    this.cancelledViewBooking = null;
    this.pendingViewBooking = null;
  }

  openRescheduleModal(booking: Booking): void {
    this.rescheduleTarget = booking;
    this.rescheduleDate = booking.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : '';
    this.rescheduleTime = booking.start_time || '';
  }

  closeRescheduleModal(): void {
    this.rescheduleTarget = null;
    this.rescheduleDate = '';
    this.rescheduleTime = '';
    this.rescheduleLoading = false;
  }

  confirmReschedule(e: Event): void {
    e.preventDefault();
    if (!this.rescheduleTarget) return;
    this.rescheduleLoading = true;

    // No backend: simulate update
    setTimeout(() => {
      const id = this.rescheduleTarget!.id;
      Object.keys(this.bookings).forEach((k) => {
        this.bookings[k] = (this.bookings[k] || []).map((b) => {
          if (b.id !== id) return b;
          return { ...b, booking_date: this.rescheduleDate, start_time: this.rescheduleTime };
        });
      });

      const formattedDate = new Date(this.rescheduleDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      this.addToast(`✅ Booking rescheduled to ${formattedDate} at ${this.rescheduleTime}`, 'success');
      this.closeRescheduleModal();
    }, 400);
  }

  openReviewModal(booking: Booking): void {
    this.reviewBooking = booking;
    this.reviewRating = 0;
    this.reviewComment = '';
    this.reviewLoading = false;
  }

  closeReviewModal(): void {
    this.reviewBooking = null;
    this.reviewRating = 0;
    this.reviewComment = '';
    this.reviewLoading = false;
  }

  submitReview(e: Event): void {
    e.preventDefault();
    if (this.reviewRating === 0) {
      this.addToast('Please select a rating', 'error');
      return;
    }
    this.reviewLoading = true;
    setTimeout(() => {
      this.reviewLoading = false;
      this.addToast('Review submitted successfully!', 'success');
      this.closeReviewModal();
    }, 400);
  }
}

