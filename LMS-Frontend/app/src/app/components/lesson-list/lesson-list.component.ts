import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
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
}
