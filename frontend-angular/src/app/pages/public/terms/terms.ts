import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms.html',
})
export class PublicTermsComponent {
  currentYear = new Date().getFullYear();
}

