import { Quiz } from './quiz.model';

export interface Question {
  id: string;
  quiz: Quiz;
  text: string;
  answer: string;
  created_at: string;
}
