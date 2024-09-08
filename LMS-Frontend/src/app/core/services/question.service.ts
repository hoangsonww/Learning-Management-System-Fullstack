import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://127.0.0.1:8000/api/questions/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question, { headers: this.getHeaders() });
  }

  updateQuestion(id: string, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}${id}/`, question, { headers: this.getHeaders() });
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
