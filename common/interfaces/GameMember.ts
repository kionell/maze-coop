import { UserInfo } from '../interfaces/UserInfo';
import { Timestamp } from '../types/Timestamp';

export interface GameMember extends UserCompact {
  joinedAt: Timestamp;
}