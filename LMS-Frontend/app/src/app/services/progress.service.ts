import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = 'http://127.0.0.1:8000/api/progress/';

  constructor(private http: HttpClient) {}

  getProgress(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProgressRecord(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  createProgress(progress: any): Observable<any> {
    return this.http.post(this.apiUrl, progress);
  }

  updateProgress(id: number, progress: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, progress);
  }

  deleteProgress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
