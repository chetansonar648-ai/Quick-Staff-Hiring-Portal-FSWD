import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Req = {
  id: number;
  title: string;
  client_name?: string;
  client_id?: number;
  worker_name?: string;
  worker_id?: number;
  service_name?: string;
  service_id?: number;
  requested_date: string;
  status: string;
};

@Component({
  selector: 'app-admin-booking-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-requests.html',
})
export class AdminBookingRequestsComponent {
  requests: Req[] = [
    { id: 1, title: 'Need a cleaner', client_name: 'John Doe', worker_name: 'Ava Johnson', service_name: 'Cleaning', requested_date: new Date().toISOString(), status: 'pending' },
  ];
  filterStatus = 'All';
  startDate = '';
  endDate = '';
  showModal = false;
  loading = false;
  clients = [{ id: 1, name: 'John Doe' }];
  workers = [{ id: 1, name: 'Ava Johnson' }];
  services = [{ id: 1, name: 'Cleaning' }];

  formData = {
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

  handleAction(id: number, status: string): void {
    if (!confirm(`Are you sure you want to ${status} this request?`)) return;
    alert(`Request ${status} successfully!`);
    this.requests = this.requests.map((r) => (r.id === id ? { ...r, status } : r));
  }

  handleCreate(e: Event): void {
    e.preventDefault();
    const newId = Math.max(0, ...this.requests.map((r) => r.id)) + 1;
    this.requests = [
      ...this.requests,
      {
        id: newId,
        title: this.formData.title,
        client_name: this.clients.find((c) => String(c.id) === String(this.formData.client_id))?.name || '',
        worker_name: this.workers.find((w) => String(w.id) === String(this.formData.worker_id))?.name || '',
        service_name: this.services.find((s) => String(s.id) === String(this.formData.service_id))?.name || '',
        requested_date: this.formData.requested_date ? new Date(this.formData.requested_date).toISOString() : new Date().toISOString(),
        status: 'pending',
      },
    ];
    alert('Request created successfully!');
    this.showModal = false;
    this.formData = {
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

  formatDate(d: string): string {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return '';
    }
  }
}

