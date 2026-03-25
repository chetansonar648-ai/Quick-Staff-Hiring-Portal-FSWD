import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-cancellation-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancellation-policy.html',
})
export class PublicCancellationPolicyComponent {
  currentYear = new Date().getFullYear();
}

