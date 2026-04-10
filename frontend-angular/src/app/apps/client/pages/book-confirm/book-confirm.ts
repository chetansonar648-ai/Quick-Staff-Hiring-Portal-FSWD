import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { WorkerProfileApi } from '../../../../services/worker.service';

@Component({
  selector: 'app-book-confirm',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-confirm.html',
})
export class BookConfirmComponent implements OnInit {
  defaultWorkerAvatar = 'https://via.placeholder.com/150';
  worker: WorkerProfileApi | null = null;
  serviceLocation = '';
  total = '';
  formattedDate = '';
  bookingReference: string | number | undefined;

  constructor(public readonly router: Router) {}

  ngOnInit(): void {
    const state = ((this.router.getCurrentNavigation()?.extras.state ?? history.state) || {}) as {
      worker?: WorkerProfileApi;
      serviceLocation?: string;
      total?: string;
      formattedDate?: string;
      bookingReference?: string | number;
    };
    this.worker = state.worker || null;
    this.serviceLocation = state.serviceLocation || '';
    this.total = state.total || '';
    this.formattedDate = state.formattedDate || '';
    this.bookingReference = state.bookingReference;

    if (!this.worker || !this.total) {
      this.router.navigate(['/client/browse-staff']);
    }
  }

  onWorkerImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = this.defaultWorkerAvatar;
  }
}

