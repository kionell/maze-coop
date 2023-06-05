import { MessageType } from '../enums/MessageType';
import { Timestamp } from '../types/Timestamp';
import { GameMember } from './GameMember';

export interface ChatMessage {
  gameId: string;
  member: GameMember;
  type: MessageType;
  content: string;
  createdAt: Timestamp;
}