import { Question } from './question.model';

export interface Choice {
  id: string;
  question: Question;
  text: string;
  is_correct: boolean;
}
