import { Timestamp } from '../types/Timestamp';

export interface UserInfo {
  id: string;
  username: string;
  createdAt: Timestamp;
}