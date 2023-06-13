export type User = {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  isLocked: boolean;
  isEnabled: boolean;
};

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
