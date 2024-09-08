import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { LessonsRoutingModule } from './lessons-routing.module';

@NgModule({
  declarations: [LessonListComponent, LessonDetailComponent],
  imports: [CommonModule, LessonsRoutingModule],
})
export class LessonsModule {}
