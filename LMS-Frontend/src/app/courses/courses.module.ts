import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesRoutingModule } from './courses-routing.module';

@NgModule({
  declarations: [CourseListComponent, CourseDetailComponent],
  imports: [CommonModule, CoursesRoutingModule],
})
export class CoursesModule {}
