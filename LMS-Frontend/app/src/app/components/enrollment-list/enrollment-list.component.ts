import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

interface Enrollment {
  _id: string;
  student: string;
  course: string;
  enrolled_at: string;
}

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  errorMessage: string = '';
  private apiUrl = 'http://127.0.0.1:8000/api/users/';

  constructor(
    private enrollmentService: EnrollmentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchEnrollments();
  }

  fetchEnrollments(): void {
    this.enrollmentService.getEnrollments().subscribe(
      (data: Enrollment[]) => {
        this.enrollments = data;
        this.fetchUserDetails();
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching enrollments.';
        }
      }
    );
  }

  fetchUserDetails(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    // Loop through enrollments and fetch user details for each
    this.enrollments.forEach((enrollment, index) => {
      this.http.get(`${this.apiUrl}${enrollment.student}/`, { headers }).subscribe(
        (userData: any) => {
          this.enrollments[index].student = userData.username;
          this.renderChart(); // Render chart after updating user details
        },
        (error) => {
          console.error(`Error fetching user details for user ID: ${enrollment.student}`, error);
        }
      );
    });
  }

  // Function to render the Chart.js pie chart
  renderChart(): void {
    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Users', 'Courses', 'Enrollments'],
        datasets: [{
          data: [
            this.enrollments.length,
            10,
            30
          ],
          backgroundColor: ['#007bff', '#ffc107', '#28a745']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
