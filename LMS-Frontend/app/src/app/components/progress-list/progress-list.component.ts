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
  loading: boolean = true; // Initialize loading to true
  chartRendered: boolean = false; // Track whether chart has been rendered
  chart: Chart<'pie'> | undefined;
  private userApiUrl = 'https://learning-management-system-fullstack.onrender.com/api/users/';
  private lessonApiUrl = 'https://learning-management-system-fullstack.onrender.com/api/lessons/';
  private totalFetches: number = 0; // Track total records
  private completedFetches: number = 0; // Track completed fetches

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
        this.totalFetches = data.length * 2; // Since we're making 2 requests per record (user and lesson)
        this.fetchUserAndLessonDetails();
      },
      (error) => {
        this.loading = false; // Stop loading in case of error
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
      // Fetch User Details
      this.http.get(`${this.userApiUrl}${record.student}/`, { headers }).subscribe(
        (userData: any) => {
          this.progressRecords[index].student = userData.username;
          this.checkIfAllFetchesCompleted(); // Increment fetch completion after user details
        },
        (userError) => {
          console.error(`Error fetching user details for user ID: ${record.student}`, userError);
        }
      );

      // Fetch Lesson Details
      this.http.get(`${this.lessonApiUrl}${record.lesson}/`, { headers }).subscribe(
        (lessonData: any) => {
          this.progressRecords[index].lesson = lessonData.title;

          if (!record.completed) {
            this.progressRecords[index].completed_at = 'N/A';
          } else {
            this.progressRecords[index].completed_at = new Date(record.completed_at).toLocaleDateString();
          }
          this.checkIfAllFetchesCompleted(); // Increment fetch completion after lesson details
        },
        (lessonError) => {
          console.error(`Error fetching lesson details for lesson ID: ${record.lesson}`, lessonError);
        }
      );
    });
  }

  checkIfAllFetchesCompleted(): void {
    this.completedFetches++;
    if (this.completedFetches === this.totalFetches) {
      this.loading = false; // Stop loading for the rest of the page
      this.renderChart(); // Render the chart only when all data is fetched
    }
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
    this.chartRendered = true; // Mark that the chart has been rendered
  }
}
