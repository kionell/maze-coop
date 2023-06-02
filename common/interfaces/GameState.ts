import { Position } from '../types/Position';

export interface GameState {
  position: Position;
  turnIndex: number;
  positions: Point[];
}