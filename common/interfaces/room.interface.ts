import { IUser } from './user.interface';

export interface IRoom {
  id: string;
  hostId: string;
  hostname: string;
  createdAt: number;
  members: IUser[];
}
