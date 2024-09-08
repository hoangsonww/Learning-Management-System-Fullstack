import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../services/lesson.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import Chart from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule], // Add CommonModule
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css']
})
export class LessonListComponent implements OnInit {
  lessons: any[] = [];
  errorMessage: string = '';

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe(
      (data) => {
        this.lessons = data;
        this.renderChart(); // Render the chart after fetching lessons
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
        } else {
          this.errorMessage = 'Error fetching lessons.';
        }
      }
    );
  }

  // Function to render the Chart.js pie chart
  renderChart(): void {
    const ctx = document.getElementById('lessonChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Lessons', 'Courses', 'Enrollments'],
        datasets: [{
          data: [this.lessons.length, 10, 30], // Replace with dynamic data as needed
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
    });
  }
}
