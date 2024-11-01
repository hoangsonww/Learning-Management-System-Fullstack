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
  styleUrls: ['./enrollment-list.component.css'],
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  errorMessage: string = '';
  loading: boolean = true; // Track loading state
  chart: Chart<'pie'> | undefined;
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/';
  coursesLength: number = 0;
  lessonsLength: number = 0;
  isAuthenticated: boolean = true; // Flag to check authentication status

  constructor(
    private enrollmentService: EnrollmentService,
    private http: HttpClient,
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
      ([enrollmentsData, coursesData, lessonsData]: [
        Enrollment[],
        any,
        any,
      ]) => {
        this.enrollments = enrollmentsData;
        this.coursesLength = coursesData.length;
        this.lessonsLength = lessonsData.length;
        this.fetchUserDetails(); // Fetch user details based on student ID
      },
      (error) => {
        this.loading = false; // Stop loading in case of error
        if (error.status === 401) {
          this.isAuthenticated = false; // Set flag to false on unauthorized access
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage =
            'Error fetching data due to expired token. Please try registering and logging in again.';
        }
        this.coursesLength = 10; // Fallback values in case of error
        this.lessonsLength = 10;
      },
    );
  }

  fetchUserDetails(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    // Fetch the entire list of users and match by ID
    const userDetailsRequest = this.http.get(`${this.apiUrl}users/`, {
      headers,
    });

    userDetailsRequest.subscribe(
      (userList: any) => {
        if (Array.isArray(userList)) {
          this.enrollments.forEach((enrollment) => {
            const matchedUser = userList.find(
              (user: any) => user.id === enrollment.student,
            );
            if (matchedUser) {
              enrollment.student = matchedUser.username;
            }
          });
          this.fetchCourseTitles(); // Fetch course titles after fetching user details
        }
      },
      (error) => {
        this.loading = false; // Stop loading even in case of error
        console.error('Error fetching user details', error);
      },
    );
  }

  fetchCourseTitles(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const coursesRequest = this.http.get(`${this.apiUrl}courses/`, { headers });

    coursesRequest.subscribe(
      (courseList: any) => {
        if (Array.isArray(courseList)) {
          this.enrollments.forEach((enrollment) => {
            const matchedCourse = courseList.find(
              (course: any) => course.id === enrollment.course,
            );
            if (matchedCourse) {
              enrollment.course = matchedCourse.title;
            }
          });
          this.loading = false;
          if (this.isAuthenticated) {
            // Ensure the chart is only rendered if authenticated
            this.renderChart();
          }
        }
      },
      (error) => {
        this.loading = false; // Stop loading even in case of error
        console.error('Error fetching course details', error);
      },
    );
  }

  renderChart(): void {
    const ctx = document.getElementById('enrollmentChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy any existing chart instance before creating a new one
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Lessons', 'Courses', 'Enrollments'],
        datasets: [
          {
            data: [
              this.lessonsLength,
              this.coursesLength,
              this.enrollments.length,
            ],
            backgroundColor: ['#007bff', '#ffc107', '#28a745'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    };

    this.chart = new Chart(ctx, chartConfig);
  }
}
