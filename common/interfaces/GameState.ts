import { GameStatus } from '../enums/GameStatus';
import { Position } from '../types/Position';
import { GameMember } from './GameMember';

export interface GameState {
  position: Position;
  turnIndex: number;
  status: GameStatus;
  member: GameMember;
}
