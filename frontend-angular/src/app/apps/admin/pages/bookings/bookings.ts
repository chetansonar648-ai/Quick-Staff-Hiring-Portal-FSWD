import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AdminBookingRow, AdminJobRequestRow, AdminService } from '../../../../services/admin.service';

type BookingRow = {
  id: number;
  client: string;
  worker: string;
  service: string;
  date: string;
  time: string;
  status: string;
  amount: string;
  pStatus?: string;
};

type RequestRow = {
  id: number;
  title: string;
  client_name: string;
  worker_name: string;
  service_name: string;
  requested_date: string;
  status: string;
};

type IdName = { id: number; name: string };

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.html',
})
export class AdminBookingsComponent implements OnInit {
  activeTab: 'bookings' | 'requests' = 'bookings';

  searchTerm = '';
  bookings: BookingRow[] = [];
  loading = false;
  error = '';
  showAddModal = false;
  form = {
    client_id: '',
    worker_id: '',
    service_id: '',
    booking_date: '',
    duration_hours: '',
    total_price: '',
    status: 'pending',
    payment_status: 'pending',
    payment_method: '',
    address: '',
  };

  requests: RequestRow[] = [];
  requestsLoading = false;
  reqError = '';
  reqFilterStatus = 'All';
  reqStartDate = '';
  reqEndDate = '';
  showReqModal = false;
  reqSaving = false;
  reqForm = {
    client_id: '',
    worker_id: '',
    service_id: '',
    title: '',
    description: '',
    requested_date: '',
    preferred_time: 'Morning',
    budget: '',
    status: 'pending',
  };

  clients: IdName[] = [];
  dbWorkers: IdName[] = [];
  services: IdName[] = [];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadBookings();
    this.loadRequests();
  }

  private loadReferenceData(): void {
    forkJoin({
      clients: this.adminService.getClients(),
      workers: this.adminService.getWorkers(),
      services: this.adminService.getServices(),
    }).subscribe({
      next: ({ clients, workers, services }) => {
        this.clients = clients.map((c) => ({ id: c.id, name: c.name }));
        this.dbWorkers = workers.map((w) => ({ id: w.id, name: w.name }));
        this.services = services.map((s) => ({ id: s.id, name: s.name }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getBookings().subscribe({
      next: (rows) => {
        this.bookings = rows.map((b) => this.mapBooking(b));
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

  private mapBooking(b: AdminBookingRow): BookingRow {
    const when = b.booking_date ? new Date(b.booking_date) : new Date();
    const price = Number(b.total_price ?? 0);
    const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    return {
      id: b.id,
      client: b.client_name || `Client #${b.client_id}`,
      worker: b.worker_name || `Worker #${b.worker_id}`,
      service: b.service_name || `Service #${b.service_id}`,
      date: when.toLocaleDateString(),
      time: when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: (b.status || 'pending').toLowerCase(),
      amount,
      pStatus: b.payment_status || 'pending',
    };
  }

  loadRequests(): void {
    this.requestsLoading = true;
    this.reqError = '';
    this.adminService.getRequests().subscribe({
      next: (rows) => {
        this.requests = rows.map((r) => this.mapRequest(r));
        this.requestsLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.reqError = AdminService.errorMessage(err);
        this.requestsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapRequest(r: AdminJobRequestRow): RequestRow {
    return {
      id: r.id,
      title: r.title || '—',
      client_name: r.client_name || '',
      worker_name: r.worker_name || '',
      service_name: r.service_name || '',
      requested_date: r.requested_date || '',
      status: (r.status || 'pending').toLowerCase(),
    };
  }

  get filteredBookings(): BookingRow[] {
    const q = (this.searchTerm || '').toLowerCase();
    return (this.bookings || []).filter(
      (b) =>
        (b.client && b.client.toLowerCase().includes(q)) || (b.worker && b.worker.toLowerCase().includes(q)),
    );
  }

  get filteredRequests(): RequestRow[] {
    return (this.requests || []).filter((r) => {
      if (this.reqFilterStatus !== 'All' && r.status !== this.reqFilterStatus.toLowerCase()) {
        return false;
      }
      const d = r.requested_date ? new Date(r.requested_date).getTime() : NaN;
      if (this.reqStartDate) {
        const start = new Date(this.reqStartDate).setHours(0, 0, 0, 0);
        if (!Number.isNaN(d) && d < start) return false;
      }
      if (this.reqEndDate) {
        const end = new Date(this.reqEndDate).setHours(23, 59, 59, 999);
        if (!Number.isNaN(d) && d > end) return false;
      }
      return true;
    });
  }

  handleAddBooking(): void {
    this.showAddModal = true;
  }

  submitBooking(e: Event): void {
    e.preventDefault();
    const client_id = Number(this.form.client_id);
    const worker_id = Number(this.form.worker_id);
    const service_id = Number(this.form.service_id);
    if (!client_id || !worker_id || !service_id || !this.form.booking_date) {
      this.error = 'Select client, worker, service, and date.';
      this.cdr.detectChanges();
      return;
    }
    this.loading = true;
    this.error = '';
    const booking_date = new Date(this.form.booking_date).toISOString();
    const body: Record<string, unknown> = {
      client_id,
      worker_id,
      service_id,
      booking_date,
      duration_hours: this.form.duration_hours ? Number(this.form.duration_hours) : null,
      total_price: Number(this.form.total_price) || 0,
      status: this.form.status || 'pending',
      address: (this.form.address || '').trim() || 'Address to be confirmed',
      special_instructions: '',
      payment_status: this.form.payment_status || 'pending',
      payment_method: (this.form.payment_method || 'card').trim() || 'card',
    };
    this.adminService.postBooking(body).subscribe({
      next: () => {
        this.showAddModal = false;
        this.form = {
          client_id: '',
          worker_id: '',
          service_id: '',
          booking_date: '',
          duration_hours: '',
          total_price: '',
          status: 'pending',
          payment_status: 'pending',
          payment_method: '',
          address: '',
        };
        this.loadBookings();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleCancelBooking(id: number): void {
    if (!confirm('Delete this booking?')) return;
    this.error = '';
    this.adminService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  handleEditBooking(id: number): void {
    const b = this.bookings.find((x) => x.id === id);
    const s = prompt('New status? (pending, accepted, in_progress, completed, cancelled)', b?.status);
    if (!s || !b || s === b.status) return;
    this.adminService.putBooking(id, { status: s }).subscribe({
      next: () => this.loadBookings(),
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  handleReqCreate(e: Event): void {
    e.preventDefault();
    const client_id = Number(this.reqForm.client_id);
    const worker_id = Number(this.reqForm.worker_id);
    const service_id = Number(this.reqForm.service_id);
    if (!client_id || !worker_id || !service_id || !this.reqForm.title?.trim() || !this.reqForm.requested_date) {
      this.reqError = 'Fill in title, client, worker, service, and requested date.';
      this.cdr.detectChanges();
      return;
    }
    this.reqSaving = true;
    this.reqError = '';
    const body: Record<string, unknown> = {
      client_id,
      worker_id,
      service_id,
      title: this.reqForm.title.trim(),
      description: this.reqForm.description?.trim() || '',
      requested_date: this.reqForm.requested_date,
      preferred_time: this.reqForm.preferred_time || 'Morning',
      budget: this.reqForm.budget ? Number(this.reqForm.budget) : null,
      status: this.reqForm.status || 'pending',
    };
    this.adminService.postRequest(body).subscribe({
      next: () => {
        this.showReqModal = false;
        this.reqForm = {
          client_id: '',
          worker_id: '',
          service_id: '',
          title: '',
          description: '',
          requested_date: '',
          preferred_time: 'Morning',
          budget: '',
          status: 'pending',
        };
        this.reqSaving = false;
        this.loadRequests();
      },
      error: (err) => {
        this.reqError = AdminService.errorMessage(err);
        this.reqSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  formatReqDate(d: string): string {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return '';
    }
  }

  capitalize(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
