import { User } from './user.model';
import { Lesson } from './lesson.model';

export interface Progress {
  id: string;
  student: User;
  lesson: Lesson;
  completed: boolean;
  completed_at: string;
}
