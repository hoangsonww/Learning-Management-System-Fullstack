import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://127.0.0.1:8000/api/quizzes/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getQuiz(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz, { headers: this.getHeaders() });
  }

  updateQuiz(id: string, quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}${id}/`, quiz, { headers: this.getHeaders() });
  }

  deleteQuiz(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
