import { UserInfo } from '../interfaces/UserInfo';
import { Timestamp } from '../types/Timestamp';
import { Color } from '../types/Color';

export interface GameMember extends UserInfo {
  joinedAt: Timestamp;
  color: Color;
}