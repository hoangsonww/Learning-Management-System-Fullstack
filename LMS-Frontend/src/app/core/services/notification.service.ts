import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://127.0.0.1:8000/api/notifications/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Token ${this.authService.getToken()}`,
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getNotification(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification, { headers: this.getHeaders() });
  }

  updateNotification(id: string, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}${id}/`, notification, { headers: this.getHeaders() });
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }
}
