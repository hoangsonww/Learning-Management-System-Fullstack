export interface User {
  id: string;
  username: string;
  email: string;
  is_instructor: boolean;
  is_student: boolean;
  bio?: string;
  profile_picture?: string;
}
