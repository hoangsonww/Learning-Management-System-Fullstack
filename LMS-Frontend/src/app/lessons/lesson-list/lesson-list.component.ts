import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../core/services/lesson.service';
import { Lesson } from '../../core/models/lesson.model';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css'],
})
export class LessonListComponent implements OnInit {
  lessons: Lesson[] = [];

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService.getLessons().subscribe(
      (data) => {
        this.lessons = data;
      },
      (error) => {
        console.error('Error fetching lessons:', error);
      }
    );
  }
}
