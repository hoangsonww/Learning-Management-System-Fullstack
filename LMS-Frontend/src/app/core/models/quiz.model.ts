import { Lesson } from './lesson.model';

export interface Quiz {
  id: string;
  lesson: Lesson;
  title: string;
  created_at: string;
}
