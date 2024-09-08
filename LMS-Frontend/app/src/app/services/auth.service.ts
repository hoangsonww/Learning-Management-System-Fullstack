import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/login/';
  private tokenKey = 'authToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((response: any) => {
        if (response && response.key) { // Corrected to check 'key' instead of 'token'
          console.log('Login successful, storing token:', response.key);
          localStorage.setItem(this.tokenKey, response.key); // Store the token with the correct key
          this.isLoggedInSubject.next(true); // Update login status
        }
      })
    );
  }

  logout(): void {
    console.log('Logging out, removing token.');
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false); // Update login status
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
