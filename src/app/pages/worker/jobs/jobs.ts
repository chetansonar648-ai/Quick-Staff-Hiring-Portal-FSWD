import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

interface WorkerJob {
  id: number;
  client_name: string;
  address?: string;
  status: string;
  service_name?: string;
  special_instructions?: string;
  booking_date?: string;
}

@Component({
  selector: 'app-worker-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './jobs.html',
})
export class WorkerJobsComponent implements OnInit, OnDestroy {
  statusFilter: string = 'pending'; // Default to requests
  jobs: WorkerJob[] = [];
  loading: boolean = false;

  titles: Record<string, string> = {
    pending: 'Job Requests',
    accepted: 'Accepted Jobs',
    in_progress: 'Active Job',
    completed: 'Past Jobs',
    rejected: 'Rejected Jobs',
    cancelled: 'Cancelled Jobs',
  };

  // Static mock data (backend disabled).
  private readonly mockJobsByStatus: Record<string, WorkerJob[]> = {
    pending: [
      {
        id: 101,
        client_name: 'Jane Doe',
        address: '123 Market St',
        status: 'pending',
        service_name: 'Cleaning',
        special_instructions: 'Please bring eco-friendly supplies.',
        booking_date: '2026-03-20T12:00:00Z',
      },
    ],
    accepted: [
      {
        id: 102,
        client_name: 'Bob Smith',
        address: '88 King Ave',
        status: 'accepted',
        service_name: 'Driver',
        special_instructions: 'Pickup at front desk.',
        booking_date: '2026-03-22T15:30:00Z',
      },
    ],
    in_progress: [
      {
        id: 103,
        client_name: 'Sarah Lee',
        address: '12 Sunset Blvd',
        status: 'in_progress',
        service_name: 'Cooking',
        special_instructions: 'Allergens: peanuts.',
        booking_date: '2026-03-23T18:45:00Z',
      },
    ],
    completed: [
      {
        id: 104,
        client_name: 'Mike Johnson',
        address: '5 River Rd',
        status: 'completed',
        service_name: 'Maintenance',
        special_instructions: 'No special instructions.',
        booking_date: '2026-02-10T11:00:00Z',
      },
    ],
    rejected: [
      {
        id: 105,
        client_name: 'Emily Davis',
        address: '210 Lakeside Dr',
        status: 'rejected',
        service_name: 'Driver',
        special_instructions: '',
        booking_date: '2026-01-08T09:00:00Z',
      },
    ],
    cancelled: [
      {
        id: 106,
        client_name: 'Chris Brown',
        address: '',
        status: 'cancelled',
        service_name: 'Cleaning',
        special_instructions: '',
        booking_date: '2025-12-15T13:15:00Z',
      },
    ],
  };

  private sub: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => this.syncFromQuery(params));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private syncFromQuery(params: ParamMap): void {
    const statusFromQuery = params.get('status');
    this.statusFilter = statusFromQuery || 'pending';
    this.jobs = this.mockJobsByStatus[this.statusFilter] || [];
  }

  getStatusPillClasses(status: string): string {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }

  async handleStatusUpdate(id: number, newStatus: string): Promise<void> {
    // Backend disabled: we update local mock state to mimic refresh behavior.
    let removedJob: WorkerJob | undefined;
    for (const key of Object.keys(this.mockJobsByStatus)) {
      const list = this.mockJobsByStatus[key];
      const idx = list.findIndex((j) => j.id === id);
      if (idx !== -1) {
        removedJob = list.splice(idx, 1)[0];
        break;
      }
    }

    if (removedJob) {
      removedJob.status = newStatus;
      this.mockJobsByStatus[newStatus].push(removedJob);
    }

    this.jobs = this.mockJobsByStatus[this.statusFilter] || [];
  }

  async handleSaveClient(_jobId: number): Promise<void> {
    // No backend: keep UI static.
  }

  isActiveStatus(status: string): boolean {
    return this.statusFilter === status;
  }
}

