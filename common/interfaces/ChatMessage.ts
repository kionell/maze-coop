import { MessageType } from '../enums/MessageType';
import { Timestamp } from '../types/Timestamp';

export interface ChatMessage {
  type: MessageType;
  content: string;
  createdAt: Timestamp;
}