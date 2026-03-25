import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type FaqItem = { q: string; a: string };

@Component({
  selector: 'app-public-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
})
export class PublicFaqComponent {
  faqs: Record<string, FaqItem[]> = {
    workers: [
      { q: 'How do I create a worker profile?', a: 'Click "Sign Up" and select "I want to WORK". Fill in your skills, experience, and availability. Once verified, you can start browsing job opportunities.' },
      { q: 'How do I get paid for completed jobs?', a: 'Payment is processed after the client confirms job completion. Funds are transferred directly to your linked bank account within 2-3 business days.' },
      { q: "Can I choose my own working hours?", a: "Absolutely! You have full control over your availability. Simply update your profile to reflect when you're available to work." },
      { q: 'What if a client cancels a job?', a: 'If a client cancels within 24 hours of the scheduled start time, you may be eligible for a cancellation fee. Check our policies for details.' },
    ],
    clients: [
      { q: 'How do I post a job?', a: 'After registering as a client, go to your dashboard and click "Post a Job". Fill in the details including job type, location, date, and required skills.' },
      { q: 'How are workers verified?', a: 'All workers undergo identity verification and background checks. We also track performance ratings and reviews from previous clients.' },
      { q: "What if I'm not satisfied with a worker?", a: 'Contact our support team immediately. We have a satisfaction guarantee and will work to resolve any issues or provide a replacement.' },
      { q: 'How does billing work?', a: "You're only charged after a job is completed and you confirm satisfaction. Payments are processed securely through our platform." },
    ],
    general: [
      { q: 'Is Quick Staff Hiring Portal free to use?', a: 'Creating an account is free. Workers keep most of their earnings, and clients pay a small service fee on completed jobs.' },
      { q: 'What areas do you serve?', a: 'We currently operate in major metropolitan areas across the United States. Check our coverage map for specific locations.' },
      { q: 'How do I contact support?', a: 'You can reach our support team via email at support@quickstaff.com or through the Help Center in your dashboard.' },
      { q: 'Is my personal information secure?', a: 'Yes, we use industry-standard encryption and security measures to protect all user data. See our Privacy Policy for details.' },
    ],
  };

  activeTab = 'general';
  openIndex: number | null = null;

  tabs = [
    { id: 'general', label: 'General' },
    { id: 'workers', label: 'For Workers' },
    { id: 'clients', label: 'For Clients' },
  ];

  get activeFaqs(): FaqItem[] {
    return this.faqs[this.activeTab] || [];
  }

  setTab(id: string): void {
    this.activeTab = id;
    this.openIndex = null;
  }

  toggleFaq(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}

