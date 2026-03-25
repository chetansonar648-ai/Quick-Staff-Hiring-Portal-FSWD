import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './how-it-works.html',
})
export class PublicHowItWorksComponent {
  clientSteps = [
    { step: '01', icon: 'edit_document', title: 'Post a Job', body: 'Describe your needs, specify skills, and set your budget in a simple form.' },
    { step: '02', icon: 'group', title: 'Review & Connect', body: 'Receive applications, browse profiles, and chat directly with candidates.' },
    { step: '03', icon: 'payments', title: 'Hire & Pay Securely', body: 'Hire with confidence. Funds are held until the job is completed.' },
  ];

  workerSteps = [
    { step: '01', icon: 'person', title: 'Create Your Profile', body: 'Showcase your skills, experience, and availability to stand out.' },
    { step: '02', icon: 'work', title: 'Find & Apply for Jobs', body: 'Browse matching jobs and apply in a few clicks. Chat with clients.' },
    { step: '03', icon: 'paid', title: 'Get Paid Quickly', body: 'Complete work and get paid promptly through our secure system.' },
  ];
}

