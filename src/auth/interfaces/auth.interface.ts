import { UserRole } from '../../../generated/prisma';

export interface IAuth {
  id: string;
  role?: UserRole;
}

export interface ILogin {
  accessToken: string;
  refreshToken?: string;
}
