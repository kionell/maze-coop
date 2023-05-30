import { IUser } from './user.interface';

export interface IGame {
  hostId: string;
  hostname: string;
  userId: string;
  username: string;
  createdAt: number;
  members: IUser[];
}
