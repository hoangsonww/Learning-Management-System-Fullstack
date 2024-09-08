import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progress } from '../models/progress.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl = 'http://127.0.0.1:8000/api/progress/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getProgresses(): Observable<Progress[]> {
    return this.http.get<Progress[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getProgress(id: string): Observable<Progress> {
    return this.http.get<Progress>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createProgress(progress: Progress): Observable<Progress> {
    return this.http.post<Progress>(this.apiUrl, progress, { headers: this.getHeaders() });
  }

  updateProgress(id: string, progress: Progress): Observable<Progress> {
    return this.http.put<Progress>(`${this.apiUrl}${id}/`, progress, { headers: this.getHeaders() });
  }

  deleteProgress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
