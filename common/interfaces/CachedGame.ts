import { ChatMessage } from './ChatMessage';
import { GameLayout } from './GameLayout';
import { Position } from '../types/Position';
import { GameInfo } from './GameInfo';
import { GameStatus } from '../enums/GameStatus';

export interface CachedGame {
  info: GameInfo;
  layout: GameLayout;
  chat: ChatMessage[];
  positions: Position[];
  status: GameStatus;
  turnIndex: number;
}
