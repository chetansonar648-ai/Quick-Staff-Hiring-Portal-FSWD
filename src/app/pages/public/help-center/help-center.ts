import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './help-center.html',
})
export class PublicHelpCenterComponent {
  categories = [
    { icon: 'person', title: 'Account & Profile', description: 'Manage your account settings, update profile information, and handle login issues.', link: '/faq' },
    { icon: 'work', title: 'Jobs & Hiring', description: 'Learn how to post jobs, apply for work, and manage your job listings.', link: '/faq' },
    { icon: 'payments', title: 'Payments & Billing', description: 'Understand payment processing, invoicing, and resolve billing questions.', link: '/faq' },
    { icon: 'security', title: 'Safety & Trust', description: 'Our verification process, safety guidelines, and reporting issues.', link: '/trust-safety' },
    { icon: 'devices', title: 'Technical Support', description: 'Troubleshoot app issues, browser compatibility, and technical problems.', link: '/contact' },
    { icon: 'policy', title: 'Policies & Guidelines', description: 'Review our terms, privacy policy, and community guidelines.', link: '/terms-of-service' },
  ];

  popularArticles = [
    'How to create a worker profile',
    'Posting your first job as a client',
    'Understanding payment processing',
    'How verification works',
    'Updating your availability',
    'Resolving disputes between parties',
  ];
}

