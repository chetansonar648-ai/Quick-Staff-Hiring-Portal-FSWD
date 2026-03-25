import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
})
export class ClientDashboardComponent {
  constructor(public router: Router) {}

  stats = {
    active: 2,
    completed: 8,
    pendingReviews: 1,
  };

  recommendedStaff: Array<{
    id: number;
    name: string;
    role: string;
    rating: number;
    rating_count: number;
    image_url?: string;
  }> = [
    { id: 1, name: 'Ava Johnson', role: 'House Cleaning', rating: 4.9, rating_count: 124, image_url: 'https://via.placeholder.com/400x240' },
    { id: 2, name: 'Noah Smith', role: 'Plumbing', rating: 4.7, rating_count: 89, image_url: 'https://via.placeholder.com/400x240' },
    { id: 3, name: 'Mia Chen', role: 'Electrical Repair', rating: 4.8, rating_count: 52, image_url: 'https://via.placeholder.com/400x240' },
    { id: 4, name: 'Liam Patel', role: 'Gardening & Landscaping', rating: 4.6, rating_count: 41, image_url: 'https://via.placeholder.com/400x240' },
  ];

  loading = false;
  error: string | null = null;
  searchQuery = '';

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

