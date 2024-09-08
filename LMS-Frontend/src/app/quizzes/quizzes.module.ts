import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizDetailComponent } from './quiz-detail/quiz-detail.component';
import { QuizzesRoutingModule } from './quizzes-routing.module';

@NgModule({
  declarations: [QuizListComponent, QuizDetailComponent],
  imports: [CommonModule, QuizzesRoutingModule],
})
export class QuizzesModule {}
