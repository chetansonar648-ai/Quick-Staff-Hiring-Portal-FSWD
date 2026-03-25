import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  bookings: number;
  spent: string;
};

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
})
export class AdminClientsComponent {
  searchTerm = '';
  clients: Client[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1111', status: 'Active', bookings: 3, spent: '$120' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-2222', status: 'Inactive', bookings: 0, spent: '$0' },
  ];
  loading = false;
  error = '';
  showAddModal = false;
  form = { name: '', email: '', phone: '' };

  get filtered(): Client[] {
    const q = (this.searchTerm || '').toLowerCase();
    return (this.clients || []).filter((c) => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q));
  }

  handleAddClient(): void {
    this.showAddModal = true;
  }

  toggleClientStatus(id: number, currentStatus: string): void {
    const isActive = currentStatus !== 'Active';
    this.clients = this.clients.map((c) => (c.id === id ? { ...c, status: isActive ? 'Active' : 'Inactive' } : c));
  }

  submitClient(e: Event): void {
    e.preventDefault();
    this.loading = true;
    const newId = Math.max(0, ...this.clients.map((c) => c.id)) + 1;
    this.clients = [
      {
        id: newId,
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        status: 'Active',
        bookings: 0,
        spent: '$0',
      },
      ...this.clients,
    ];
    this.showAddModal = false;
    this.form = { name: '', email: '', phone: '' };
    this.error = '';
    this.loading = false;
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}

