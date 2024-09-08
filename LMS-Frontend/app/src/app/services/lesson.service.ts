import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://127.0.0.1:8000/api/lessons/';

  constructor(private http: HttpClient) {}

  getLessons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getLesson(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  createLesson(lesson: any): Observable<any> {
    return this.http.post(this.apiUrl, lesson);
  }

  updateLesson(id: number, lesson: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, lesson);
  }

  deleteLesson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
