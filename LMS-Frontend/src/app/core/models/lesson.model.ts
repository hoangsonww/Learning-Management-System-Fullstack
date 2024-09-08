import { Course } from './course.model';

export interface Lesson {
  id: string;
  title: string;
  course: Course;
  content: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}
