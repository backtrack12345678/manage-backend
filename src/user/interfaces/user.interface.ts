import { UserRole } from '../../../generated/prisma';

export interface IUserResponse {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
