import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/progress/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // Helper method to get the authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Get all progress records
  getProgress(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Get a specific progress record by ID
  getProgressRecord(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}${id}/`, { headers });
  }

  // Create a new progress record
  createProgress(progress: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, progress, { headers });
  }

  // Update an existing progress record by ID
  updateProgress(id: number, progress: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}/`, progress, { headers });
  }

  // Delete a progress record by ID
  deleteProgress(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}/`, { headers });
  }
}
