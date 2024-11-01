import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../services/lesson.service';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css'],
})
export class LessonListComponent implements OnInit {
  lessons: any[] = [];
  errorMessage: string = '';
  loading: boolean = true; // Track loading state
  chart: Chart<'pie'> | undefined;
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/';
  enrollmentsLength: number = 0;
  coursesLength: number = 0;

  constructor(
    private lessonService: LessonService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe(
      (data) => {
        this.lessons = data;
        this.fetchAllData();
      },
      (error) => {
        this.loading = false; // Stop loading in case of error
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching lessons.';
        }
      },
    );
  }

  fetchAllData(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const enrollments$ = this.http.get(`${this.apiUrl}enrollments/`, {
      headers,
    });
    const courses$ = this.http.get(`${this.apiUrl}courses/`, { headers });

    forkJoin([enrollments$, courses$]).subscribe(
      ([enrollmentsData, coursesData]: [any, any]) => {
        this.enrollmentsLength = enrollmentsData.length;
        this.coursesLength = coursesData.length;
        this.loading = false; // Stop loading once data is fetched
        this.renderChart(); // Render the chart after data fetching is complete
      },
      (error) => {
        this.loading = false; // Stop loading even in case of error
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
          this.enrollmentsLength = 30;
          this.coursesLength = 10;
        } else {
          this.errorMessage =
            'Error fetching data due to expired token. Please try registering and logging in again.';
          this.enrollmentsLength = 30;
          this.coursesLength = 10;
        }
        this.renderChart();
      },
    );
  }

  renderChart(): void {
    const ctx = document.getElementById('lessonChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Lessons', 'Courses', 'Enrollments'],
        datasets: [
          {
            data: [
              this.lessons.length,
              this.coursesLength,
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
