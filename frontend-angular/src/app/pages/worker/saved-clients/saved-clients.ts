import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, from } from 'rxjs';

import { WorkerService, type SavedClientApi } from '../../../services/worker.service';

@Component({
  selector: 'app-worker-saved-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saved-clients.html',
})
export class SavedClientsComponent implements OnInit {
  clients: SavedClientApi[] = [];
  loading = true;
  error: string | null = null;

  selectedClient: SavedClientApi | null = null;
  searchQuery = '';
  sortOption: 'recent' | 'name' = 'recent';

  constructor(
    private readonly workerService: WorkerService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;
    from(this.workerService.getSavedClients())
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (clients) => {
          this.clients = clients;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = WorkerService.errorMessage(err);
          this.clients = [];
          this.cdr.detectChanges();
        },
      });
  }

  get filteredClients(): SavedClientApi[] {
    const q = (this.searchQuery || '').trim().toLowerCase();
    const list = !q
      ? [...this.clients]
      : this.clients.filter((c) => {
          return (
            (c.name || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q)
          );
        });

    if (this.sortOption === 'name') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    // "recent" keeps backend order (created_at DESC).
    return list;
  }

  openClient(client: SavedClientApi): void {
    this.selectedClient = client;
  }

  closeClient(): void {
    this.selectedClient = null;
  }
}

