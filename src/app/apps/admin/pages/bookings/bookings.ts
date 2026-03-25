import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.html',
})
export class AdminBookingsComponent {
  activeTab: 'bookings' | 'requests' = 'bookings';

  // --- BOOKINGS STATE ---
  searchTerm = '';
  bookings: BookingRow[] = [
    {
      id: 101,
      client: 'Client #1',
      worker: 'Worker #1',
      service: 'Cleaning',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      amount: '$120.00',
      pStatus: 'pending',
    },
  ];
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
  };

  // --- REQUESTS STATE ---
  requests: RequestRow[] = [
    {
      id: 201,
      title: 'Need help with moving',
      client_name: 'Client #2',
      worker_name: 'Worker #3',
      service_name: 'Moving',
      requested_date: new Date().toISOString(),
      status: 'pending',
    },
  ];
  reqFilterStatus = 'All';
  reqStartDate = '';
  reqEndDate = '';
  showReqModal = false;
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

  // --- SHARED DATA ---
  clients = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];
  dbWorkers = [
    { id: 1, name: 'Ava Johnson' },
    { id: 2, name: 'Noah Smith' },
  ];
  services = [
    { id: 1, name: 'Cleaning' },
    { id: 2, name: 'Moving' },
  ];

  get filteredBookings(): BookingRow[] {
    const q = (this.searchTerm || '').toLowerCase();
    return (this.bookings || []).filter(
      (b) => (b.client && b.client.toLowerCase().includes(q)) || (b.worker && b.worker.toLowerCase().includes(q)),
    );
  }

  handleAddBooking(): void {
    this.showAddModal = true;
  }

  submitBooking(e: Event): void {
    e.preventDefault();
    this.loading = true;
    const newId = Math.max(0, ...this.bookings.map((b) => b.id)) + 1;
    const when = this.form.booking_date ? new Date(this.form.booking_date) : new Date();
    this.bookings = [
      ...this.bookings,
      {
        id: newId,
        client: `Client #${this.form.client_id || '0'}`,
        worker: `Worker #${this.form.worker_id || '0'}`,
        service: `Service #${this.form.service_id || '0'}`,
        date: when.toLocaleDateString(),
        time: when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: this.form.status || 'pending',
        amount: this.form.total_price ? `$${Number(this.form.total_price).toFixed(2)}` : '$0',
        pStatus: this.form.payment_status,
      },
    ];
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
    };
    this.loading = false;
  }

  handleCancelBooking(id: number): void {
    if (!confirm('Delete this booking?')) return;
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }

  handleEditBooking(id: number): void {
    const b = this.bookings.find((x) => x.id === id);
    const s = prompt('New status?', b?.status);
    if (s && b && s !== b.status) this.updateBookingStatus(id, s);
  }

  updateBookingStatus(id: number, status: string): void {
    this.bookings = this.bookings.map((b) => (b.id === id ? { ...b, status } : b));
  }

  handleReqCreate(e: Event): void {
    e.preventDefault();
    const newId = Math.max(0, ...this.requests.map((r) => r.id)) + 1;
    this.requests = [
      ...this.requests,
      {
        id: newId,
        title: this.reqForm.title,
        client_name: this.clients.find((c) => String(c.id) === String(this.reqForm.client_id))?.name || '',
        worker_name: this.dbWorkers.find((w) => String(w.id) === String(this.reqForm.worker_id))?.name || '',
        service_name: this.services.find((s) => String(s.id) === String(this.reqForm.service_id))?.name || '',
        requested_date: this.reqForm.requested_date ? new Date(this.reqForm.requested_date).toISOString() : new Date().toISOString(),
        status: this.reqForm.status || 'pending',
      },
    ];
    alert('Request created!');
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

