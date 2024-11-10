import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl =
    'https://learning-management-system-fullstack.onrender.com/api/auth/login/';
  private registerUrl =
    'https://learning-management-system-fullstack.onrender.com/api/auth/registration/'; // Registration endpoint
  private validateUrl =
    'https://learning-management-system-fullstack.onrender.com/api/enrollments/'; // Token validation endpoint
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

  // Check if the token is valid by making a test API request
  isTokenValid(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isLoggedInSubject.next(false);
      return of(false); // No token means invalid
    }

    // Set up headers with the token
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    });

    // Make a request to validate the token
    return this.http.get(this.validateUrl, { headers }).pipe(
      map(() => {
        this.isLoggedInSubject.next(true); // Token is valid
        return true;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.logout(); // Clear the token if it's invalid
          return of(false);
        }
        return of(true); // Other errors treated as valid for now
      }),
    );
  }

  // Private method to check if a token is stored
  private hasToken(): boolean {
    return !!this.getToken();
  }
}
