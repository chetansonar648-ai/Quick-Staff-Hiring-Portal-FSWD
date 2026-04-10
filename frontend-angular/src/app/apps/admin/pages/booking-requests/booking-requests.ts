import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { AdminJobRequestRow, AdminService } from '../../../../services/admin.service';

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

type IdName = { id: number; name: string };

@Component({
  selector: 'app-admin-booking-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-requests.html',
})
export class AdminBookingRequestsComponent implements OnInit {
  requests: Req[] = [];
  filterStatus = 'All';
  startDate = '';
  endDate = '';
  showModal = false;
  loading = false;
  error = '';
  saving = false;
  clients: IdName[] = [];
  workers: IdName[] = [];
  services: IdName[] = [];

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

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRefs();
    this.loadRequests();
  }

  private loadRefs(): void {
    forkJoin({
      clients: this.adminService.getClients(),
      workers: this.adminService.getWorkers(),
      services: this.adminService.getServices(),
    }).subscribe({
      next: ({ clients, workers, services }) => {
        this.clients = clients.map((c) => ({ id: c.id, name: c.name }));
        this.workers = workers.map((w) => ({ id: w.id, name: w.name }));
        this.services = services.map((s) => ({ id: s.id, name: s.name }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  loadRequests(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getRequests().subscribe({
      next: (rows) => {
        this.requests = rows.map((r) => this.mapReq(r));
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

  private mapReq(r: AdminJobRequestRow): Req {
    return {
      id: r.id,
      title: r.title || '—',
      client_name: r.client_name,
      client_id: r.client_id,
      worker_name: r.worker_name,
      worker_id: r.worker_id,
      service_name: r.service_name,
      service_id: r.service_id,
      requested_date: r.requested_date || '',
      status: (r.status || 'pending').toLowerCase(),
    };
  }

  get filteredRequests(): Req[] {
    return this.requests.filter((r) => {
      if (this.filterStatus !== 'All' && r.status !== this.filterStatus.toLowerCase()) {
        return false;
      }
      const d = r.requested_date ? new Date(r.requested_date).getTime() : NaN;
      if (this.startDate) {
        const start = new Date(this.startDate).setHours(0, 0, 0, 0);
        if (!Number.isNaN(d) && d < start) return false;
      }
      if (this.endDate) {
        const end = new Date(this.endDate).setHours(23, 59, 59, 999);
        if (!Number.isNaN(d) && d > end) return false;
      }
      return true;
    });
  }

  handleAction(id: number, status: string): void {
    if (!confirm(`Are you sure you want to mark this request as ${status}?`)) return;
    this.error = '';
    this.adminService.putRequest(id, { status }).subscribe({
      next: () => this.loadRequests(),
      error: (err) => {
        this.error = AdminService.errorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  handleCreate(e: Event): void {
    e.preventDefault();
    const client_id = Number(this.formData.client_id);
    const worker_id = Number(this.formData.worker_id);
    const service_id = Number(this.formData.service_id);
    if (!client_id || !worker_id || !service_id || !this.formData.title?.trim() || !this.formData.requested_date) {
      this.error = 'Fill in title, client, worker, service, and date.';
      this.cdr.detectChanges();
      return;
    }
    this.saving = true;
    this.error = '';
    this.adminService
      .postRequest({
        client_id,
        worker_id,
        service_id,
        title: this.formData.title.trim(),
        description: this.formData.description?.trim() || '',
        requested_date: this.formData.requested_date,
        preferred_time: this.formData.preferred_time || 'Morning',
        budget: this.formData.budget ? Number(this.formData.budget) : null,
        status: 'pending',
      })
      .subscribe({
        next: () => {
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
          this.saving = false;
          this.loadRequests();
        },
        error: (err) => {
          this.error = AdminService.errorMessage(err);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  formatDate(d: string): string {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return '';
    }
  }
}
