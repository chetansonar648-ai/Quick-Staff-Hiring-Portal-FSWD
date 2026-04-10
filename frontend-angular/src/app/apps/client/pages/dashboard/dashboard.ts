import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, forkJoin, from, of } from 'rxjs';

import { ClientService, type StaffCard } from '../../../../services/client.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class ClientDashboardComponent implements OnInit {
  constructor(
    public router: Router,
    private readonly clientService: ClientService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  stats = { active: 0, completed: 0, pendingReviews: 0 };

  recommendedStaff: StaffCard[] = [];

  loading = true;
  error: string | null = null;
  searchQuery = '';

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    forkJoin({
      stats: from(this.clientService.getClientStats()).pipe(catchError(() => of(this.stats))),
      recommended: from(this.clientService.getRecommendedStaff(4)).pipe(catchError(() => of([] as StaffCard[]))),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ stats, recommended }) => {
          this.stats = stats;
          this.recommendedStaff = recommended;
          this.error = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = ClientService.errorMessage(err);
          this.recommendedStaff = [];
          this.cdr.detectChanges();
        },
      });
  }

  handleCategoryClick(category: string): void {
    this.router.navigate(['/client/browse-staff'], { queryParams: { category } });
  }

  handleSearch(e?: Event): void {
    e?.preventDefault();
    const query: any = {};
    if (this.searchQuery.trim()) query.search = this.searchQuery;
    this.router.navigate(['/client/browse-staff'], { queryParams: query });
  }

  handleFiltersClick(): void {
    const query: any = { showFilters: true };
    if (this.searchQuery.trim()) query.search = this.searchQuery;
    this.router.navigate(['/client/browse-staff'], { queryParams: query });
  }

  formatRating(value: any): string {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  }
}

