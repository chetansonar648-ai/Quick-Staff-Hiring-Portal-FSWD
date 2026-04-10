import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, from } from 'rxjs';

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
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;
    from(this.clientService.getSavedWorkers())
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (saved) => {
          this.workers = (saved || []).map((w: any) => ({ ...w, worker_id: w.worker_id ?? w.id }));
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.workers = [];
          this.cdr.detectChanges();
        },
      });
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

  handleRemove(workerId: number): void {
    if (confirm('Remove this worker from your saved list?')) {
      this.loading = true;
      this.error = null;
      from(this.clientService.removeSavedWorker(workerId)).subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  formatRating(value: any): string {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  }
}

