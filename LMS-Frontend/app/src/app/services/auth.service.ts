import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl =
    'https://learning-management-system-fullstack.onrender.com/api/auth/login/';
  private registerUrl =
    'https://learning-management-system-fullstack.onrender.com/api/auth/registration/'; // Registration endpoint
  private tokenKey = 'authToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password }).pipe(
      tap((response: any) => {
        if (response && response.key) {
          localStorage.setItem(this.tokenKey, response.key);
          this.isLoggedInSubject.next(true);
        }
      }),
    );
  }

  // Registration method
  register(
    username: string,
    email: string,
    password1: string,
    password2: string,
  ): Observable<any> {
    return this.http
      .post(this.registerUrl, {
        username,
        email,
        password1,
        password2,
      })
      .pipe(
        tap((response: any) => {
          console.log('Registration successful:', response);
          // Handle post-registration logic here, like logging in the user, or redirecting them
        }),
      );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if the user is logged in
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Private method to check if a token is stored
  private hasToken(): boolean {
    return !!this.getToken();
  }
}
