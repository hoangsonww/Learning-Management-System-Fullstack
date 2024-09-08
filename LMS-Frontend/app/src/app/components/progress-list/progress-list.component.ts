import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

interface Progress {
  _id: string;
  student: string;
  lesson: string;
  completed: boolean;
  completed_at: string;
}

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
        this.fetchUserAndLessonDetails(); // Fetch user and lesson details for each progress record
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
      // Fetch user details
      this.http.get(`${this.userApiUrl}${record.student}/`, { headers }).subscribe(
        (userData: any) => {
          this.progressRecords[index].student = userData.username;

          // Fetch lesson details after user data
          this.http.get(`${this.lessonApiUrl}${record.lesson}/`, { headers }).subscribe(
            (lessonData: any) => {
              this.progressRecords[index].lesson = lessonData.title;

              // Set 'Completed At' to 'N/A' if not completed
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

  // Function to render the Chart.js pie chart
  renderChart(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    new Chart(ctx, {
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
    });
  }
}
