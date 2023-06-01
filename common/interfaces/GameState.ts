import { Point } from '../types/Point';

export interface GameState {
  turnIndex: number;
  positions: Point[];
}