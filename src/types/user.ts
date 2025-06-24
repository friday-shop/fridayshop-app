import type { ERole } from '../constants/user';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: ERole;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}
