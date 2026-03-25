import { Component } from '@angular/core';
import { LoginComponent } from './pages/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],   // ✅ ADD THIS
  templateUrl: './app.html',
})
export class App {}