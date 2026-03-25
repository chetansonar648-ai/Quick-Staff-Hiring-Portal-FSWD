import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
})
export class PublicHomeComponent {
  categories = [
    { icon: 'celebration', label: 'Event Staff' },
    { icon: 'restaurant_menu', label: 'Hospitality' },
    { icon: 'warehouse', label: 'Warehouse' },
    { icon: 'security', label: 'Security' },
    { icon: 'liquor', label: 'Bartenders' },
    { icon: 'campaign', label: 'Promoters' },
    { icon: 'cleaning_services', label: 'Cleaners' },
    { icon: 'construction', label: 'General Labor' },
  ];

  testimonials = [
    {
      quote:
        '"This platform is a lifesaver! I needed event staff on short notice and found three amazing people within an hour. Incredibly efficient."',
      name: 'Sarah L.',
      title: 'Event Planner',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGOyFEBX7bgCQqZqY31_ShhKpA2zgfdhmD11qU1X9WPpxc9AL5tOAKh-NKOyW5XOPlXLDeVcG37s8lqKZF3p17vWSqxtM3pkqFDxhUGCEpl4jc9cPDpGzPtOn3s-6C98Wbrh2VUHsLMbJp0S8b4_Y7O0tb4tStgAmvvRSpKjs1Zxh-zTVXY5d-9rliSLtV7BV7fofVFOLrBXjcF9f85jUP4cfRVPMOSEJY84uKuiNq4sABN79TF0CWr0RfL7E-9dJHfuFXj7DWw',
    },
    {
      quote:
        '"As a gig worker, finding consistent jobs used to be tough. Now, my schedule is always full with great opportunities. The payment system is fast and secure."',
      name: 'Mark Chen',
      title: 'Freelance Bartender',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBjHznO-qOZgszv5hW0d99LP3x8-IcqytPXjADilOT0VeOUQZPgUzGe8jwb9vmcJ7GPjfsv50ohhS3dDKLcxlnl6Udgt0tkY5j5cRzdgzX144WIANz9ke1kNRL3s3lgzsSBIaYzSc7Bg0xJH4rir1kkfT4Dr6fcla9sYKXb2YUigbfIzzYs5k-EkP7ygpVGXLiLGmIya3ukB3qHsBoOYnKvMPGCHXMqn3_RehNgUyGax0Og1drRhQRx6A6n3GA4XnAZQbrQphgr6g',
    },
    {
      quote: '"The quality of talent on Quick Staff is exceptional. We\'ve hired several warehouse workers who have become essential parts of our team."',
      name: 'David R.',
      title: 'Logistics Manager',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5lGDhEyIlFuQJ183M9A37lcNUNaGuEQdT8i3Hb2YbY4fwoUnlNuN6gpEfuTnEXHOexLcOIZOOFrz2llENaZn4Xua9OUcFk79biBv-KewZRaRhpqZPiXvkeKM4rJ7Cdkc7XJnmYP0H3BrzhqlA-D4sMq3G7hRSAG5UsFVUSVmpLnPzps3uL79XjAoBf67OGokpZB_o-Rrjn2xiSx2lOjqBORTNcPlToyvA1bfwvsv0bPq3Kq5fbk8r6v1TXZmQDpI5ZZiQDlO4mw',
    },
  ];
}

