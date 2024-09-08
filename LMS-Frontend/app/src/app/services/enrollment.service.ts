import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/enrollments/';

  constructor(private http: HttpClient) {}

  getEnrollments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getEnrollment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  createEnrollment(enrollment: any): Observable<any> {
    return this.http.post(this.apiUrl, enrollment);
  }

  updateEnrollment(id: number, enrollment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, enrollment);
  }

  deleteEnrollment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
