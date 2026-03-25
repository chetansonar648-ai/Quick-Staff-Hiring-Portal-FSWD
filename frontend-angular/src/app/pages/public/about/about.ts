import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
})
export class PublicAboutComponent {
  team = [
    { name: 'Jane Doe', title: 'CEO & Co-Founder', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGOyFEBX7bgCQqZqY31_ShhKpA2zgfdhmD11qU1X9WPpxc9AL5tOAKh-NKOyW5XOPlXLDeVcG37s8lqKZF3p17vWSqxtM3pkqFDxhUGCEpl4jc9cPDpGzPtOn3s-6C98Wbrh2VUHsLMbJp0S8b4_Y7O0tb4tStgAmvvRSpKjs1Zxh-zTVXY5d-9rliSLtV7BV7fofVFOLrBXjcF9f85jUP4cfRVPMOSEJY84uKuiNq4sABN79TF0CWr0RfL7E-9dJHfuFXj7DWw' },
    { name: 'John Smith', title: 'CTO & Co-Founder', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjHznO-qOZgszv5hW0d99LP3x8-IcqytPXjADilOT0VeOUQZPgUzGe8jwb9vmcJ7GPjfsv50ohhS3dDKLcxlnl6Udgt0tkY5j5cRzdgzX144WIANz9ke1kNRL3s3lgzsSBIaYzSc7Bg0xJH4rir1kkfT4Dr6fcla9sYKXb2YUigbfIzzYs5k-EkP7ygpVGXLiLGmIya3ukB3qHsBoOYnKvMPGCHXMqn3_RehNgUyGax0Og1drRhQRx6A6n3GA4XnAZQbrQphgr6g' },
    { name: 'Emily White', title: 'Head of Operations', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5lGDhEyIlFuQJ183M9A37lcNUNaGuEQdT8i3Hb2YbY4fwoUnlNuN6gpEfuTnEXHOexLcOIZOOFrz2llENaZn4Xua9OUcFk79biBv-KewZRaRhpqZPiXvkeKM4rJ7Cdkc7XJnmYP0H3BrzhqlA-D4sMq3G7hRSAG5UsFVUSVmpLnPzps3uL79XjAoBf67OGokpZB_o-Rrjn2xiSx2lOjqBORTNcPlToyvA1bfwvsv0bPq3Kq5fbk8r6v1TXZmQDpI5ZZiQDlO4mw' },
    { name: 'Michael Brown', title: 'Head of Marketing', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9TfYKEqZsGsU-zAstQIhWmoLfWgbnGaIk0U-ZQ64ank0chlSeJp9R3XPho1jZYh5EoboAAoNkWX9MgpUrEd73PbJONNSJYUHgj_8-NcebwVNBnYvuhnbCIU_0Zv24ywHOQeU1I_-6Ak8vwYdVMJS-N29NvfKITwv39WSUTE6ctvpPGJD0jrxqOLtdvxuNTWbZZAlE3tGsH3jonpdSx9V6lT5NO7Ia1CIw8uj9pHR5bJtDvNFPwKPaM39iqNKLLn3adrxXeHV3Tw' },
  ];

  stats = [
    { label: 'Successful Gigs Completed', value: '10k+' },
    { label: 'Client Satisfaction Rate', value: '98%' },
    { label: 'Active Gig Workers', value: '5,000+' },
  ];

  values = [
    { icon: 'rocket_launch', title: 'Our Mission', body: 'Empower individuals with flexible work and provide businesses reliable on-demand talent.' },
    { icon: 'visibility', title: 'Our Vision', body: 'Be the most trusted and efficient platform for connecting gig workers and clients.' },
    { icon: 'verified', title: 'Our Values', body: 'Trust, Efficiency, Empowerment, Community, and Innovation.' },
  ];
}

