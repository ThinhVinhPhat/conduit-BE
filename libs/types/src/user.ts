import { User } from '@prisma/client';

export interface IUserResponse {
  status: number;
  data?: User | User[];
  message: string;
}
