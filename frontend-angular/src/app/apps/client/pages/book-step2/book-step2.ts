import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, from } from 'rxjs';

import { WorkerService, type WorkerProfileApi } from '../../../../services/worker.service';

@Component({
  selector: 'app-book-step2',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-step2.html',
})
export class BookStep2Component implements OnInit {
  defaultWorkerAvatar = 'https://via.placeholder.com/150';
  workerId: string | null = null;
  worker: WorkerProfileApi | null = null;
  loading = true;
  service: unknown = null;
  date = '';
  time = '';
  displayDate = 'Date';

  formData = {
    location: '',
    duration: '4',
    instructions: '',
  };

  constructor(
    private readonly router: Router,
    public readonly route: ActivatedRoute,
    private readonly workerService: WorkerService,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.workerId = this.route.snapshot.queryParamMap.get('workerId');
    const navState = ((this.router.getCurrentNavigation()?.extras.state ?? history.state) || {}) as {
      worker?: WorkerProfileApi;
      service?: unknown;
      date?: string;
      time?: string;
    };
    this.worker = navState.worker || null;
    this.service = navState.service ?? null;
    this.date = navState.date || '';
    this.time = navState.time || '';
    this.displayDate = this.date
      ? new Date(this.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Date';

    if (!this.worker && this.workerId) {
      from(this.workerService.getWorkerProfile(Number(this.workerId)))
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (worker) => (this.worker = worker),
          error: () => (this.worker = null),
        });
      return;
    }
    this.loading = false;
  }

  onWorkerImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = this.defaultWorkerAvatar;
  }

  handleNext(): void {
    this.router.navigate(['/client/book/step-3'], {
      state: {
        worker: this.worker,
        service: this.service,
        date: this.date,
        time: this.time,
        ...this.formData,
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}

