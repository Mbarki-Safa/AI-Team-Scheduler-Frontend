import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    } 
   
    // Check role if needed
    if (route.data['roles']) {
      const currentUser = this.authService.getCurrentUser();
      const requiredRoles = route.data['roles'] as UserRole[];
      
      if (!currentUser || !requiredRoles.includes(currentUser.role)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
  
}