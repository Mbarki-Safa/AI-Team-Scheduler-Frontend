import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/User';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit  {
  title = 'AI-Team Scheduler';
  user: User | null = null;

  
  ngOnInit() {
    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
 /*  currentPage = 'Calendar';
  
  setCurrentPage(page: string) {
    this.currentPage = page;
  } */

    constructor(private router: Router , private authService: AuthService) {}

    // Function to check if the current page is Login or Register
    isAuthPage(): boolean {
      return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
    }
     // Function to handle logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
