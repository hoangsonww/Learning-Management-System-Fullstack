import { User } from './user.model';
import { Course } from './course.model';

export interface Enrollment {
  id: string;
  student: User;
  course: Course;
  enrolled_at: string;
}
