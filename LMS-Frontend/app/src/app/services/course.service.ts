import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Import AuthService to get the token

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://127.0.0.1:8000/api/courses/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to get the authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all courses
  getCourses(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Get a specific course by ID
  getCourse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}${id}/`, { headers });
  }

  // Create a new course
  createCourse(course: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, course, { headers });
  }

  // Update an existing course by ID
  updateCourse(id: number, course: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}/`, course, { headers });
  }

  // Delete a course by ID
  deleteCourse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}/`, { headers });
  }
}
