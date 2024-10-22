import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { LessonListComponent } from './components/lesson-list/lesson-list.component';
import { EnrollmentListComponent } from './components/enrollment-list/enrollment-list.component';
import { ProgressListComponent } from './components/progress-list/progress-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'lessons', component: LessonListComponent },
  { path: 'enrollments', component: EnrollmentListComponent },
  { path: 'progress', component: ProgressListComponent },
  { path: '**', component: NotFoundComponent },
];
