import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/enrollments/';

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

  // Get all enrollments
  getEnrollments(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Get a specific enrollment by ID
  getEnrollment(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}${id}/`, { headers });
  }

  // Create a new enrollment
  createEnrollment(enrollment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, enrollment, { headers });
  }

  // Update an existing enrollment by ID
  updateEnrollment(id: number, enrollment: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}/`, enrollment, { headers });
  }

  // Delete an enrollment by ID
  deleteEnrollment(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}/`, { headers });
  }
}
