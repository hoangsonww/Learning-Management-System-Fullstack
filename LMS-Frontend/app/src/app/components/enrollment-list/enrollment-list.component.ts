import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

interface Enrollment {
  _id: string;
  student: string;
  course: string;
  enrolled_at: string;
}

Chart.register(...registerables);

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
  chart: Chart<'pie'> | undefined;
  private apiUrl = 'http://127.0.0.1:8000/api/';
  coursesLength: number = 0;
  lessonsLength: number = 0;

  constructor(
    private enrollmentService: EnrollmentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const enrollments$ = this.enrollmentService.getEnrollments();
    const courses$ = this.http.get(`${this.apiUrl}courses/`, { headers });
    const lessons$ = this.http.get(`${this.apiUrl}lessons/`, { headers });

    forkJoin([enrollments$, courses$, lessons$]).subscribe(
      ([enrollmentsData, coursesData, lessonsData]: [Enrollment[], any, any]) => {
        this.enrollments = enrollmentsData;
        this.coursesLength = coursesData.length;
        this.lessonsLength = lessonsData.length;
        this.fetchUserDetails();
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching data.';
        }
        this.coursesLength = 10;
        this.lessonsLength = 10;
        this.renderChart();
      }
    );
  }

  fetchUserDetails(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const userDetailsRequests = this.enrollments.map((enrollment) =>
      this.http.get(`${this.apiUrl}users/${enrollment.student}/`, { headers })
    );

    forkJoin(userDetailsRequests).subscribe(
      (userDetails: any[]) => {
        userDetails.forEach((userData, index) => {
          this.enrollments[index].student = userData.username;
        });
        this.renderChart();
      },
      (error) => {
        console.error('Error fetching user details', error);
        this.renderChart();
      }
    );
  }

  renderChart(): void {
    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Lessons', 'Courses', 'Enrollments'],
        datasets: [{
          data: [
            this.lessonsLength,
            this.coursesLength,
            this.enrollments.length
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
    };

    this.chart = new Chart(ctx, chartConfig);
  }
}
