import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface Progress {
  _id: string;
  student: string;
  lesson: string;
  completed: boolean;
  completed_at: string;
}

Chart.register(...registerables);

@Component({
  selector: 'app-progress-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.css']
})
export class ProgressListComponent implements OnInit {
  progressRecords: Progress[] = [];
  errorMessage: string = '';
  chart: Chart<'pie'> | undefined;
  private userApiUrl = 'http://127.0.0.1:8000/api/users/';
  private lessonApiUrl = 'http://127.0.0.1:8000/api/lessons/';

  constructor(
    private progressService: ProgressService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchProgress();
  }

  fetchProgress(): void {
    this.progressService.getProgress().subscribe(
      (data: Progress[]) => {
        this.progressRecords = data;
        this.fetchUserAndLessonDetails();
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching progress records.';
        }
      }
    );
  }

  fetchUserAndLessonDetails(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    this.progressRecords.forEach((record, index) => {
      this.http.get(`${this.userApiUrl}${record.student}/`, { headers }).subscribe(
        (userData: any) => {
          this.progressRecords[index].student = userData.username;
          this.http.get(`${this.lessonApiUrl}${record.lesson}/`, { headers }).subscribe(
            (lessonData: any) => {
              this.progressRecords[index].lesson = lessonData.title;

              if (!record.completed) {
                this.progressRecords[index].completed_at = 'N/A';
              } else {
                this.progressRecords[index].completed_at = new Date(record.completed_at).toLocaleDateString();
              }

              this.renderChart();
            },
            (lessonError) => {
              console.error(`Error fetching lesson details for lesson ID: ${record.lesson}`, lessonError);
            }
          );
        },
        (userError) => {
          console.error(`Error fetching user details for user ID: ${record.student}`, userError);
        }
      );
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Completed', 'Not Completed'],
        datasets: [{
          data: [
            this.progressRecords.filter(record => record.completed).length,
            this.progressRecords.filter(record => !record.completed).length
          ],
          backgroundColor: ['#28a745', '#dc3545']
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
