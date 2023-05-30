import { IUser } from './user.interface';

export interface IRoom {
  hostId: string;
  hostname: string;
  userId: string;
  username: string;
  createdAt: number;
  members: IUser[];
}
