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
  private refreshTokenTimeout: any;
  
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
    this.setupTokenRefresh();
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
    this.stopRefreshTokenTimer();
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

  //refresh token methods 

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  
  private startRefreshTokenTimer(): void {
    const jwtToken = this.getToken();
    if (!jwtToken) return;
    
    const jwtPayload = JSON.parse(atob(jwtToken.split('.')[1]));
    const expires = new Date(jwtPayload.exp * 1000);
    
    // Refresh 1 minute before token expires
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }
  
  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
  
  private setupTokenRefresh(): void {
    if (this.isLoggedIn()) {
      this.startRefreshTokenTimer();
    }
  }
  
  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      this.startRefreshTokenTimer();
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
