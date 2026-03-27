import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-careers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers.html',
})
export class PublicCareersComponent {
  openings = [
    { title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time' },
    { title: 'UX Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Support', location: 'Remote', type: 'Full-time' },
    { title: 'Marketing Specialist', department: 'Marketing', location: 'New York, NY', type: 'Full-time' },
  ];

  benefits = [
    { icon: 'health_and_safety', title: 'Health & Wellness', description: 'Comprehensive health, dental, and vision coverage for you and your family.' },
    { icon: 'work_history', title: 'Flexible Work', description: 'Remote-first culture with flexible hours to fit your lifestyle.' },
    { icon: 'school', title: 'Learning & Growth', description: 'Professional development budget and mentorship programs.' },
    { icon: 'savings', title: 'Competitive Pay', description: 'Above-market compensation with equity options.' },
  ];
}

