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
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  errorMessage: string = '';
  chart: Chart<'pie'> | undefined;
  private apiUrl = 'http://127.0.0.1:8000/api/';
  lessonsLength: number = 0;
  enrollmentsLength: number = 0;

  constructor(
    private courseService: CourseService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const courses$ = this.courseService.getCourses();
    const lessons$ = this.http.get(`${this.apiUrl}lessons/`, { headers });
    const enrollments$ = this.http.get(`${this.apiUrl}enrollments/`, { headers });

    forkJoin([courses$, lessons$, enrollments$]).subscribe(
      ([coursesData, lessonsData, enrollmentsData]: [any[], any, any]) => {
        this.courses = coursesData;
        this.lessonsLength = lessonsData.length;
        this.enrollmentsLength = enrollmentsData.length;
        this.renderChart();
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching data.';
        }
        this.lessonsLength = 20;
        this.enrollmentsLength = 50;
        this.renderChart();
      }
    );
  }

  formatInstructorName(instructor: any): string {
    return 'John Doe';
  }

  renderChart(): void {
    const ctx = document.getElementById('courseChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Courses', 'Lessons', 'Enrollments'],
        datasets: [{
          data: [this.courses.length, this.lessonsLength, this.enrollmentsLength],
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
