import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';
import { CategoryService } from './services/category.service';
import { LessonService } from './services/lesson.service';
import { QuizService } from './services/quiz.service';
import { QuestionService } from './services/question.service';
import { ChoiceService } from './services/choice.service';
import { EnrollmentService } from './services/enrollment.service';
import { ProgressService } from './services/progress.service';
import { NotificationService } from './services/notification.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoginComponent
  ],
  providers: [
    AuthService,
    UserService,
    CourseService,
    CategoryService,
    LessonService,
    QuizService,
    QuestionService,
    ChoiceService,
    EnrollmentService,
    ProgressService,
    NotificationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
