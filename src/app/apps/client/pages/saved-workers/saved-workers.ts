import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientService } from '../../../../services/client.service';

@Component({
  selector: 'app-saved-workers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saved-workers.html',
})
export class SavedWorkersComponent implements OnInit {
  defaultWorkerAvatar = 'https://via.placeholder.com/400x300';

  workers: Array<any> = [
    {
      id: 1,
      worker_id: 101,
      name: 'Ava Johnson',
      role: 'Cleaning',
      description: 'Reliable and detail-oriented cleaner with 5+ years of experience.',
      rating: 4.9,
      rating_count: 124,
      image_url: 'https://via.placeholder.com/400x300',
    },
    {
      id: 2,
      worker_id: 102,
      name: 'Noah Smith',
      role: 'Plumbing',
      description: 'Licensed plumber for repairs, installs, and maintenance.',
      rating: 4.7,
      rating_count: 89,
      image_url: 'https://via.placeholder.com/400x300',
    },
  ];

  loading = true;
  error: string | null = null;
  searchQuery = '';

  constructor(
    public router: Router,
    private readonly clientService: ClientService,
  ) {}

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const saved = await this.clientService.getSavedWorkers();
      // UI expects `worker_id` key; service returns `id`.
      this.workers = (saved || []).map((w: any) => ({ ...w, worker_id: w.worker_id ?? w.id }));
    } catch (err) {
      this.error = ClientService.errorMessage(err);
      this.workers = [];
    } finally {
      this.loading = false;
    }
  }

  get filteredWorkers(): any[] {
    const q = (this.searchQuery || '').toLowerCase();
    return (this.workers || []).filter((worker) => {
      return (
        worker.name?.toLowerCase().includes(q) ||
        worker.role?.toLowerCase().includes(q) ||
        (worker.description && worker.description.toLowerCase().includes(q))
      );
    });
  }

  async handleRemove(workerId: number): Promise<void> {
    if (confirm('Remove this worker from your saved list?')) {
      this.loading = true;
      this.error = null;
      try {
        await this.clientService.removeSavedWorker(workerId);
        await this.load();
      } catch (err) {
        this.error = ClientService.errorMessage(err);
        alert(this.error);
        this.loading = false;
      }
    }
  }

  formatRating(value: any): string {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  }
}

