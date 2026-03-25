import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Worker = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  rating: number;
  jobs: number;
};

@Component({
  selector: 'app-admin-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workers.html',
})
export class AdminWorkersComponent {
  searchTerm = '';
  workers: Worker[] = [
    { id: 1, name: 'Ava Johnson', email: 'ava@example.com', phone: '555-1234', status: 'Active', rating: 4.9, jobs: 42 },
    { id: 2, name: 'Noah Smith', email: 'noah@example.com', phone: '555-5678', status: 'Inactive', rating: 4.7, jobs: 18 },
  ];
  loading = false;
  error = '';
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  selectedWorker: Worker | null = null;
  form = { name: '', email: '', phone: '' };
  editForm = { name: '', email: '', phone: '' };

  get filtered(): Worker[] {
    return (this.workers || []).filter((w) => {
      const q = (this.searchTerm || '').toLowerCase();
      return (
        (w.name || '').toLowerCase().includes(q) ||
        (w.email || '').toLowerCase().includes(q) ||
        (w.phone || '').toLowerCase().includes(q)
      );
    });
  }

  submitWorker(e: Event): void {
    e.preventDefault();
    if (!this.form.name || !this.form.email) return;
    const newId = Math.max(0, ...this.workers.map((w) => w.id)) + 1;
    this.workers = [
      ...this.workers,
      { id: newId, name: this.form.name, email: this.form.email, phone: this.form.phone, status: 'Active', rating: 0, jobs: 0 },
    ];
    this.showAddModal = false;
    this.form = { name: '', email: '', phone: '' };
  }

  handleEditWorker(worker: Worker): void {
    this.selectedWorker = worker;
    this.editForm = { name: worker.name, email: worker.email, phone: worker.phone };
    this.showEditModal = true;
  }

  submitEditWorker(e: Event): void {
    e.preventDefault();
    if (!this.selectedWorker) return;
    this.workers = this.workers.map((w) => (w.id === this.selectedWorker!.id ? { ...w, ...this.editForm } : w));
    this.showEditModal = false;
    this.selectedWorker = null;
  }

  handleViewWorker(worker: Worker): void {
    this.selectedWorker = worker;
    this.showViewModal = true;
  }

  handleRemoveWorker(id: number): void {
    if (!confirm('Are you sure you want to remove this worker?')) return;
    this.workers = this.workers.filter((w) => w.id !== id);
  }

  toggleWorkerStatus(id: number, currentStatus: string): void {
    const isActive = currentStatus !== 'Active';
    this.workers = this.workers.map((w) => (w.id === id ? { ...w, status: isActive ? 'Active' : 'Inactive' } : w));
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}

