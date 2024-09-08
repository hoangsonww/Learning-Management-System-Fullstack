import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Choice } from '../models/choice.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChoiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/choices/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getChoices(): Observable<Choice[]> {
    return this.http.get<Choice[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getChoice(id: string): Observable<Choice> {
    return this.http.get<Choice>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createChoice(choice: Choice): Observable<Choice> {
    return this.http.post<Choice>(this.apiUrl, choice, { headers: this.getHeaders() });
  }

  updateChoice(id: string, choice: Choice): Observable<Choice> {
    return this.http.put<Choice>(`${this.apiUrl}${id}/`, choice, { headers: this.getHeaders() });
  }

  deleteChoice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
