import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiUrl = 'http://127.0.0.1:8000/api/lessons/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson, { headers: this.getHeaders() });
  }

  updateLesson(id: string, lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}${id}/`, lesson, { headers: this.getHeaders() });
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
