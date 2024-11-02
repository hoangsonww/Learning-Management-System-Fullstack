import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  errorMessage: string = '';
  loading: boolean = true; // Track loading state
  chart: Chart<'pie'> | undefined;
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/';
  lessonsLength: number = 0;
  enrollmentsLength: number = 0;
  isAuthenticated: boolean = true; // Flag to check authentication status

  constructor(
    private courseService: CourseService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const courses$ = this.courseService.getCourses();
    const lessons$ = this.http.get(`${this.apiUrl}lessons/`, { headers });
    const enrollments$ = this.http.get(`${this.apiUrl}enrollments/`, {
      headers,
    });

    forkJoin([courses$, lessons$, enrollments$]).subscribe(
      ([coursesData, lessonsData, enrollmentsData]: [any[], any, any]) => {
        this.courses = coursesData;
        this.lessonsLength = lessonsData.length;
        this.enrollmentsLength = enrollmentsData.length;
        this.loading = false; // Stop loading after data fetching is complete
        if (this.isAuthenticated) {
          this.renderChart(); // Render the chart after data is fetched
        }
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
        this.lessonsLength = 20;
        this.enrollmentsLength = 50;
        if (this.isAuthenticated) {
          this.renderChart(); // Ensure the chart is only rendered if authenticated
        }
      },
    );
  }

  formatInstructorName(instructor: any): string {
    return 'John Doe';
  }

  renderChart(): void {
    const ctx = document.getElementById('courseChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy any existing chart instance before creating a new one
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Courses', 'Lessons', 'Enrollments'],
        datasets: [
          {
            data: [
              this.courses.length,
              this.lessonsLength,
              this.enrollmentsLength,
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
