import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    this.load();
  }

  private async load(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.clients = await this.workerService.getSavedClients();
    } catch (err) {
      this.error = WorkerService.errorMessage(err);
      this.clients = [];
    } finally {
      this.loading = false;
    }
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

