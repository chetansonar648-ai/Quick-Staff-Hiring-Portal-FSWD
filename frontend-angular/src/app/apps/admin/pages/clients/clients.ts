import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../../services/admin.service';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  is_active: boolean;
  bookings: number;
  spent: string;
};

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
})
export class AdminClientsComponent implements OnInit {
  searchTerm = '';
  clients: Client[] = [];
  loading = false;
  error = '';
  showAddModal = false;
  form = { name: '', email: '', phone: '', address: '' };
  saving = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getClients().subscribe({
      next: (rows) => {
        this.clients = rows.map((r) => this.mapClient(r));
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

  private mapClient(r: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    is_active?: boolean;
    booking_count?: number;
    total_spent?: string | number | null;
  }): Client {
    const active = r.is_active !== false;
    const spentNum = Number(r.total_spent ?? 0);
    const spent =
      spentNum > 0
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(spentNum)
        : '$0';
    return {
      id: r.id,
      name: r.name || '',
      email: r.email || '',
      phone: r.phone || '',
      is_active: active,
      status: active ? 'Active' : 'Inactive',
      bookings: Number(r.booking_count ?? 0),
      spent,
    };
  }

  get filtered(): Client[] {
    const q = (this.searchTerm || '').toLowerCase();
    return (this.clients || []).filter(
      (c) => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q),
    );
  }

  handleAddClient(): void {
    this.showAddModal = true;
  }

  toggleClientStatus(c: Client): void {
    const next = !c.is_active;
    this.adminService.putUserStatus(c.id, next).subscribe({
      next: () => {
        c.is_active = next;
        c.status = next ? 'Active' : 'Inactive';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  submitClient(e: Event): void {
    e.preventDefault();
    if (!this.form.name?.trim() || !this.form.email?.trim()) return;
    this.saving = true;
    this.error = '';
    this.adminService
      .postClient({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        phone: this.form.phone?.trim() || undefined,
        address: this.form.address?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.showAddModal = false;
          this.form = { name: '', email: '', phone: '', address: '' };
          this.saving = false;
          this.loadClients();
        },
        error: (err) => {
          this.error = AdminService.errorMessage(err);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }
}
