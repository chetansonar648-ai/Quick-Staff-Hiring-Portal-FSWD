import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, forkJoin, from, of } from 'rxjs';

import { ClientService, type BrowseCategory } from '../../../../services/client.service';
import { WorkerService, type WorkerProfileApi } from '../../../../services/worker.service';

@Component({
  selector: 'app-book-step1',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-step1.html',
})
export class BookStep1Component implements OnInit {
  defaultWorkerAvatar = 'https://via.placeholder.com/150';
  workerId: string | null = null;
  worker: WorkerProfileApi | null = null;
  loading = true;
  error: string | null = null;
  categories: BrowseCategory[] = [];
  selectedDate: string | null = null;
  selectedTimeSlot: string | null = null;
  monthOffset = 0;

  constructor(
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly workerService: WorkerService,
    private readonly clientService: ClientService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.workerId = this.route.snapshot.queryParamMap.get('workerId');
    this.loadData();
  }

  get today(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + this.monthOffset);
    return d;
  }

  get daysInMonth(): number {
    const d = this.today;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }

  get startDay(): number {
    const d = this.today;
    return new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  }

  get monthLabel(): string {
    return this.today.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  get calendarCells(): number[] {
    return Array.from({ length: 35 }, (_, i) => i);
  }

  isDate(index: number): boolean {
    const day = index - this.startDay + 1;
    return day > 0 && day <= this.daysInMonth;
  }

  getDay(index: number): number {
    return index - this.startDay + 1;
  }

  getDateStr(index: number): string {
    const day = this.getDay(index);
    return `${this.today.getFullYear()}-${String(this.today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  isPast(index: number): boolean {
    if (!this.isDate(index)) return false;
    const dateStr = this.getDateStr(index);
    return new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
  }

  selectDate(index: number): void {
    if (!this.isDate(index) || this.isPast(index)) return;
    this.selectedDate = this.getDateStr(index);
  }

  onWorkerImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) img.src = this.defaultWorkerAvatar;
  }

  goToCategory(category: string): void {
    this.router.navigate(['/client/browse-staff'], { queryParams: { category } });
  }

  handleNext(): void {
    if (!this.selectedDate || !this.selectedTimeSlot) {
      alert('Please select a date and time.');
      return;
    }
    this.router.navigate(['/client/book/step-2'], {
      queryParams: { workerId: this.workerId || '' },
      state: {
        worker: this.worker,
        service: null,
        date: this.selectedDate,
        time: this.selectedTimeSlot,
      },
    });
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;
    const worker$ = this.workerId ? from(this.workerService.getWorkerProfile(Number(this.workerId))) : of(null);
    const categories$ = this.workerId ? of([] as BrowseCategory[]) : from(this.clientService.getBrowseCategories());
    forkJoin({ worker: worker$, categories: categories$ })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ worker, categories }) => {
          this.worker = worker;
          this.categories = categories || [];
          if (this.workerId && !worker) {
            this.error = 'Worker not found.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Worker fetch failed:', err);
          this.worker = null;
          this.categories = [];
          this.error = this.workerId ? 'Failed to load worker.' : 'Failed to load categories.';
          this.cdr.detectChanges();
        },
      });
  }
}

