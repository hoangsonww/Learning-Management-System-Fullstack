import { User } from './user.model';

export interface Notification {
  id: string;
  recipient: User;
  message: string;
  created_at: string;
  is_read: boolean;
}
