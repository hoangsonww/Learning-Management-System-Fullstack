import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface Progress {
  _id: string;
  student: string;
  lesson: string;
  completed: boolean;
  completed_at: string | null;
}

interface MappedProgress {
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
  styleUrls: ['./progress-list.component.css'],
})
export class ProgressListComponent implements OnInit {
  progressRecords: MappedProgress[] = []; // This will now hold the new list of mapped progress data
  errorMessage: string = '';
  loading: boolean = true; // Track loading state
  chart: Chart<'pie'> | undefined;
  private apiUrl =
    'https://learning-management-system-fullstack.onrender.com/api/';
  lessonsLength: number = 0;
  usersLength: number = 0;

  constructor(
    private progressService: ProgressService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    const progress$ = this.progressService.getProgress();
    const lessons$ = this.http.get<any[]>(`${this.apiUrl}lessons/`, {
      headers,
    }); // Fetch lessons
    const users$ = this.http.get<any[]>(`${this.apiUrl}users/`, { headers }); // Fetch users

    forkJoin([progress$, lessons$, users$]).subscribe(
      ([progressData, lessonsData, usersData]: [Progress[], any[], any[]]) => {
        this.lessonsLength = lessonsData.length;
        this.usersLength = usersData.length;

        this.progressRecords = this.mapUserAndLessonDetails(
          progressData,
          usersData,
          lessonsData,
        ); // Create a new list
        this.loading = false;
        this.renderChart();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Unauthorized access. Please log in.';
      },
    );
  }

  // Helper function to get a random item from an array
  getRandomItem(arr: any[]): any {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  // Create a new list of progresses with random student names and lesson titles
  mapUserAndLessonDetails(
    progressData: Progress[],
    usersData: any[],
    lessonsData: any[],
  ): MappedProgress[] {
    return progressData.map((progress) => {
      const randomUser = this.getRandomItem(usersData);
      const randomLesson = this.getRandomItem(lessonsData);

      return {
        _id: progress._id,
        student: randomUser ? randomUser.username : 'Unknown User', // Assign random user
        lesson: randomLesson ? randomLesson.title : 'Unknown Lesson', // Assign random lesson
        completed: progress.completed,
        completed_at: progress.completed_at
          ? new Date(progress.completed_at).toLocaleDateString()
          : 'N/A', // Format date or show 'N/A'
      };
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destroy any existing chart instance before creating a new one
    }

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Completed', 'Not Completed'],
        datasets: [
          {
            data: [
              this.progressRecords.filter((record) => record.completed).length,
              this.progressRecords.filter((record) => !record.completed).length,
            ],
            backgroundColor: ['#28a745', '#dc3545'],
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
