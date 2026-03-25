import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
})
export class PublicCategoriesComponent {
  searchTerm = '';

  categories = [
    {
      title: 'Drivers',
      desc: 'Reliable and professional drivers for any occasion.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyM8Y1vhqCF_MwHUEAqMFU42Jcyg2Mn7xUVahKhO1MuClrGlogQ1nGZaneclgjIVsogr1kvww4GD0huT77xVI8fi8zG3H1w7jeeB2bfh0ZBgORj7zl1GPQhYFnIr9SuZBcM5MacKVvgaX24zX3oMkVzQgc-lR8WPU_5aHoS9P0olya1OLlcW_uVLzDIKzwTjG0vs7zl55YB38hlIaYPqUi5V8WldiFE-2grhQLrP7NsOttASIkxO14Ns5PfCDxn08Pq9MUegZ3ig',
    },
    {
      title: 'Cooks',
      desc: 'Experienced cooks for your home or events.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC134eQBux76MOIS_Izx9oXXPi0xIp3_wXriW7IQxclVdL9xwjtA1kh72V3vKLvAkdrN7LsJg1cpXF6WCTheBgca41lFyX1pTxyJABmOpoRvFwqk9YyykZzelp7ibb_Ov081lxzohvIbVmXxa-CdQzwntcIr_vhsApocp04xWlS2vdybttRgZrSKIvHKiss2cvoYoi0vrxvCEe3q50Ew1UxR9Gf0FrdAnOCiQKiUCVn_X0t4j1Dj9WA8CQTVWeNUVMKx-Kwm7mVzQ',
    },
    {
      title: 'Gardeners',
      desc: 'Skilled gardeners to maintain your outdoor spaces.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADXBydA7-iKwNsYvyhCR7YdGUQ6HMMHtM8x6oIeEiO4H6xKllDbQ2ig3yMwVYJyMYfB0TQ2UPqCftZP-uitqwV4OHYHfKwEUx4dDj_VXPe-Vbo2DaUAPB5U3FBQDbAv-cyFjJv2qGInve8J-Lqa6QTNT2KwFumSA2eSunhJ_FvZvAkD92RuXKtHUdLKEdbHFovzh0yNhv7OiWuD4AzTbXpqs03zb6hHC1oRm1EFmdc0aqWhQml54BC7EW6EJueu-vx2MDKR5HYdw',
    },
    {
      title: 'Cleaners',
      desc: 'Thorough and efficient cleaning services.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqYBhkEqHb3pYn1wwn2mqxdMH84_y6-A0PBmivVes14Ya_79-aPeEL7vEAKF_voVyPhSY1yql3Xm4ovTEzfTejUrcuzTzez_GOPB4k7vIv3qdYbqB4F8Xn8tArJINNvXk-v9r5PIithkKjJxuNWnm-bNWaTGRjjCc5zZYLv23NlzF3lVyi5BHf510LzW4-gJ5fXZnyPBhgD1YFpNFwtbnauZAMk97_AGor_PRDryyh1k6orHxlZXqEgILyxfvAZt3SPaBwan9Mag',
    },
    {
      title: 'Handymen',
      desc: 'Expert help for repairs and maintenance tasks.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv_5tCkYAvRKIdYQCvQJokjeGim8MCT5hPrPcxorUp_xxLfmJarKD0Itpem0m3qGFs35HbocZhW4Jb1SqxctQFVIQwxIHbqbPXvrfLXzdO5HiuxhUFYWpFSF2F15rJ0-M9Fxyno1F-YD1_5I2WablDE4GCkTiJjrx7U5r47ohPqhKGv2xNT0_JQ7VfkkW4DeqDlz9dFeOqyuKPvBHtw8238gyYyjrKMy6Wi9sMFkHMrrvdcb_8thrF0Cogm_km9EMOPUKf9jTA6g',
    },
    {
      title: 'Electrician',
      desc: 'Safe and certified electrical services for your home.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpWxh-kjF5iSJC8WCa-gSFzWhSio2NcVlRRerfttS_r0M0mdYU5JSLoe32_FUh293h9AFisLfRPEntDlNaRsyUw4dSYkobRVo1kAntD2bK2n_bBnLTR0lQoB0Nh6HNtctJ1LDkyMYozSjZSK6FAkM7TzJo1QLy8wjGWRmdWyJ9p_4acjgM4ZzzD7ewW0lli2OfbeJ3Bck89MwdV4grAi-gSBKpH0k1j_rmRy6X4wqu7KoLQcdpp1BrURhF_vb5hVOWvi96M2tfWg',
    },
  ];

  get filteredCategories() {
    const q = (this.searchTerm || '').toLowerCase();
    return this.categories.filter((cat) => cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
  }
}

