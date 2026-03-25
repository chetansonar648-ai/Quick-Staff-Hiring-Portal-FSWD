import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-trust-safety',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trust-safety.html',
})
export class PublicTrustSafetyComponent {
  safetyFeatures = [
    { icon: 'verified_user', title: 'Identity Verification', description: "All users undergo identity verification to ensure you're connecting with real people." },
    { icon: 'fact_check', title: 'Background Checks', description: 'Workers can opt into background checks for additional credibility with clients.' },
    { icon: 'star', title: 'Ratings & Reviews', description: 'Transparent feedback system helps you make informed decisions about who you work with.' },
    { icon: 'shield', title: 'Secure Payments', description: 'All transactions are processed securely with fraud protection measures in place.' },
    { icon: 'support_agent', title: '24/7 Support', description: 'Our safety team is available around the clock to address any concerns.' },
    { icon: 'lock', title: 'Data Protection', description: 'Your personal information is encrypted and never shared without your consent.' },
  ];

  guidelines = [
    { title: 'Communicate Through the Platform', description: 'Keep all job-related communication within Quick Staff to maintain a record and ensure your safety.' },
    { title: 'Meet in Public Places', description: 'For initial meetings, choose public locations. Trust your instincts if something feels off.' },
    { title: 'Verify Before You Commit', description: 'Check profiles, ratings, and reviews before agreeing to work with someone new.' },
    { title: 'Report Suspicious Activity', description: 'If you encounter any concerning behavior, report it immediately through our platform.' },
  ];
}

