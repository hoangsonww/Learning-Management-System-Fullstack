import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../core/services/lesson.service';
import { Lesson } from '../../core/models/lesson.model';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css'],
})
export class LessonDetailComponent implements OnInit {
  lesson!: Lesson;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLesson(id);
    }
  }

  loadLesson(id: string): void {
    this.lessonService.getLesson(id).subscribe(
      (data) => {
        this.lesson = data;
      },
      (error) => {
        console.error('Error fetching lesson:', error);
      }
    );
  }
}
