import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../../services/admin.service';

type Worker = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  is_active: boolean;
  rating: number;
  jobs: number;
};

@Component({
  selector: 'app-admin-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workers.html',
})
export class AdminWorkersComponent implements OnInit {
  searchTerm = '';
  workers: Worker[] = [];
  loading = false;
  error = '';
  saving = false;
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  selectedWorker: Worker | null = null;
  form = { name: '', email: '', phone: '' };
  editForm = { name: '', email: '', phone: '' };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getWorkers().subscribe({
      next: (rows) => {
        this.workers = rows.map((r) => this.mapWorker(r));
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

  private mapWorker(r: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    is_active?: boolean;
    rating?: number | string | null;
    completed_jobs?: number | null;
  }): Worker {
    const active = r.is_active !== false;
    return {
      id: r.id,
      name: r.name || '',
      email: r.email || '',
      phone: r.phone || '',
      is_active: active,
      status: active ? 'Active' : 'Inactive',
      rating: Math.round((Number(r.rating) || 0) * 10) / 10,
      jobs: Number(r.completed_jobs ?? 0),
    };
  }

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
    if (!this.form.name?.trim() || !this.form.email?.trim()) return;
    this.saving = true;
    this.error = '';
    this.adminService
      .postWorker({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        phone: this.form.phone?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.showAddModal = false;
          this.form = { name: '', email: '', phone: '' };
          this.saving = false;
          this.loadWorkers();
        },
        error: (err) => {
          this.error = AdminService.errorMessage(err);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  handleEditWorker(worker: Worker): void {
    this.selectedWorker = worker;
    this.editForm = { name: worker.name, email: worker.email, phone: worker.phone };
    this.showEditModal = true;
  }

  submitEditWorker(e: Event): void {
    e.preventDefault();
    if (!this.selectedWorker) return;
    const id = this.selectedWorker.id;
    this.saving = true;
    this.error = '';
    this.adminService
      .putWorker(id, {
        name: this.editForm.name.trim(),
        email: this.editForm.email.trim(),
        phone: this.editForm.phone?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.showEditModal = false;
          this.selectedWorker = null;
          this.saving = false;
          this.loadWorkers();
        },
        error: (err) => {
          this.error = AdminService.errorMessage(err);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  handleViewWorker(worker: Worker): void {
    this.selectedWorker = worker;
    this.showViewModal = true;
  }

  handleRemoveWorker(id: number): void {
    if (!confirm('Are you sure you want to remove this worker?')) return;
    this.error = '';
    this.adminService.deleteWorker(id).subscribe({
      next: () => this.loadWorkers(),
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  toggleWorkerStatus(w: Worker): void {
    const next = !w.is_active;
    this.adminService.putUserStatus(w.id, next).subscribe({
      next: () => {
        w.is_active = next;
        w.status = next ? 'Active' : 'Inactive';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}
