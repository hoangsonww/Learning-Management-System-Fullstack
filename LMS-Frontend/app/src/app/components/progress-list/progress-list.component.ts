import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { UserService } from '../../services/user.service'; // Import UserService
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

// Define interfaces for Progress, User, and Lesson
interface Progress {
  _id: string;
  student: string;
  lesson: string;
  completed: boolean;
  completed_at: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  is_instructor: boolean;
  is_student: boolean;
  bio: string;
  profile_picture: string;
}

interface Lesson {
  _id: string;
  title: string;
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
  users: User[] = [];
  lessons: Lesson[] = [];
  errorMessage: string = '';

  constructor(
    private progressService: ProgressService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Fetch users and lessons data first
    this.userService.getUsers().subscribe(
      (usersData: User[]) => {
        this.users = usersData; // Store users data
        this.fetchLessons(); // Fetch lessons after users data is fetched
      },
      (error) => {
        this.errorMessage = 'Error fetching users.';
      }
    );
  }

  fetchLessons(): void {
    this.lessons = [
      { _id: '66dde39af395abfee65d1fa8', title: 'Introduction to Calculus' },
    ];
    this.fetchProgress();
  }

  fetchProgress(): void {
    this.progressService.getProgress().subscribe(
      (data: Progress[]) => {
        const userMap = new Map<string, string>();
        this.users.forEach(user => userMap.set(user._id, user.username));

        const lessonMap = new Map<string, string>();
        this.lessons.forEach(lesson => lessonMap.set(lesson._id, lesson.title));

        this.progressRecords = data.map((progress: Progress) => ({
          ...progress,
          student: userMap.get(progress.student) || progress.student,
          lesson: lessonMap.get(progress.lesson) || progress.lesson,
          completed_at: new Date(progress.completed_at).toLocaleDateString()
        }));
        this.renderChart();
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
