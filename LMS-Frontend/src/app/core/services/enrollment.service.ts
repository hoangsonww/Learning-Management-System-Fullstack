import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/enrollments/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEnrollment(id: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, enrollment, { headers: this.getHeaders() });
  }

  updateEnrollment(id: string, enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}${id}/`, enrollment, { headers: this.getHeaders() });
  }

  deleteEnrollment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
