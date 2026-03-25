import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientService, type StaffCard } from '../../../../services/client.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class ClientDashboardComponent implements OnInit {
  constructor(public router: Router, private readonly clientService: ClientService) {}

  stats = { active: 0, completed: 0, pendingReviews: 0 };

  recommendedStaff: StaffCard[] = [];

  loading = true;
  error: string | null = null;
  searchQuery = '';

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const [stats, recommended] = await Promise.all([
        this.clientService.getClientStats(),
        this.clientService.getRecommendedStaff(4),
      ]);
      this.stats = stats;
      this.recommendedStaff = recommended;
    } catch (err) {
      this.error = (err instanceof Error ? err.message : 'Failed to load dashboard') || null;
      this.recommendedStaff = [];
    } finally {
      this.loading = false;
    }
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

