import { User } from './user.model';
import { Category } from './category.model';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  category: Category;
  created_at: string;
  updated_at: string;
  image?: string;
  price: number;
  published: boolean;
}
