import type { UserRole } from '../types/user-role';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
