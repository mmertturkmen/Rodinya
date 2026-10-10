import type { UserRole } from '../types/user-role';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}
