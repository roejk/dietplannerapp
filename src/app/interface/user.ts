import { UserRole } from '../enum/user-role.enum';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  userRole: UserRole;
  isLocked: boolean;
  isEnabled: boolean;
}
