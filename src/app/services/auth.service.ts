import { Injectable } from '@angular/core';

import { AuthResponse , LoginRequest, RegisterRequest, User } from './../models/User';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }
  
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }
  
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }
    
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }
  
  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getLoggedInUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }
  
}
