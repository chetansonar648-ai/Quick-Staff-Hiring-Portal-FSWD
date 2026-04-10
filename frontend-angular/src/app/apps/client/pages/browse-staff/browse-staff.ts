import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, finalize, forkJoin, from, of } from 'rxjs';

import { ClientService, type BrowseCategory, type StaffCard } from '../../../../services/client.service';

@Component({
  selector: 'app-browse-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-staff.html',
})
export class BrowseStaffComponent implements OnInit, OnDestroy {
  defaultWorkerAvatar = 'https://via.placeholder.com/400x300';

  staff: StaffCard[] = [];
  loading = true;
  error: string | null = null;
  filters = {
    search: '',
    location: '',
    category: '',
    min_price: '',
    max_price: '',
    min_rating: '',
  };
  showFilters = false;
  selectedWorker: any = null;
  showProfileModal = false;
  categories: BrowseCategory[] = [];
  savingWorker = false;

  // Modal-only state
  activeTab = 'overview';
  workerDetails: any = null;

  private sub?: Subscription;
  private filterFetchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private readonly clientService: ClientService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      this.filters = {
        ...this.filters,
        search: params.get('search') || '',
        category: params.get('category') || '',
      };
      this.showFilters = params.get('showFilters') === 'true';
      this.loadCategoriesAndStaff();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private loadCategoriesAndStaff(): void {
    this.loading = true;
    this.error = null;
    const categories$ =
      this.categories.length === 0
        ? from(this.clientService.getBrowseCategories()).pipe(catchError(() => of([] as BrowseCategory[])))
        : of(this.categories);

    forkJoin({
      categories: categories$,
      staff: from(this.clientService.getBrowseStaff(this.filters)).pipe(catchError(() => of([] as StaffCard[]))),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ categories, staff }) => {
          this.categories = categories;
          this.staff = staff;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.staff = [];
          this.cdr.detectChanges();
        },
      });
  }

  private loadStaffOnly(): void {
    this.loading = true;
    this.error = null;
    from(this.clientService.getBrowseStaff(this.filters))
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (staff) => {
          this.staff = staff;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.staff = [];
          this.cdr.detectChanges();
        },
      });
  }

  handleFilterChange(key: keyof BrowseStaffComponent['filters'], value: string): void {
    this.filters = { ...this.filters, [key]: value };
    if (this.filterFetchTimeout) clearTimeout(this.filterFetchTimeout);
    this.filterFetchTimeout = setTimeout(() => {
      this.loadStaffOnly();
    }, 300);
  }

  handleViewProfile(workerId: number): void {
    this.router.navigate(['/client/staff', workerId]);
  }

  async handleSaveWorker(workerId: number): Promise<void> {
    this.savingWorker = true;
    try {
      await this.clientService.saveWorker(workerId);
    } catch (err) {
      this.error = ClientService.errorMessage(err);
    } finally {
      this.savingWorker = false;
    }
  }

  getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
      Cleaning: 'cleaning_services',
      Plumbing: 'plumbing',
      Electrical: 'electrical_services',
      Construction: 'construction',
      Marketing: 'campaign',
      'Event Staff': 'celebration',
      Hospitality: 'restaurant',
      Administrative: 'edit_note',
      Warehouse: 'local_shipping',
      Retail: 'store',
      Delivery: 'delivery_dining',
    };
    return map[category] || 'category';
  }

  formatRating(value: any): string {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  }

  openProfileModal(worker: any): void {
    this.selectedWorker = worker;
    this.workerDetails = worker;
    this.activeTab = 'overview';
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedWorker = null;
    this.workerDetails = null;
  }

  handleClearFilters(): void {
    this.filters = { search: '', location: '', category: '', min_price: '', max_price: '', min_rating: '' };
    if (this.filterFetchTimeout) clearTimeout(this.filterFetchTimeout);
    this.filterFetchTimeout = setTimeout(() => {
      this.loadStaffOnly();
    }, 300);
  }

  repeatFilledStars(rating: number): string {
    const r = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
    return '★'.repeat(r);
  }

  repeatEmptyStars(rating: number): string {
    const r = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
    return '☆'.repeat(5 - r);
  }

  formatDate(value: any): string {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  }
}

