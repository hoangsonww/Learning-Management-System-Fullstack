import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/lessons/';

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

  // Get all lessons
  getLessons(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Get a specific lesson by ID
  getLesson(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}${id}/`, { headers });
  }

  // Create a new lesson
  createLesson(lesson: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, lesson, { headers });
  }

  // Update an existing lesson by ID
  updateLesson(id: number, lesson: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}${id}/`, lesson, { headers });
  }

  // Delete a lesson by ID
  deleteLesson(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}${id}/`, { headers });
  }
}
