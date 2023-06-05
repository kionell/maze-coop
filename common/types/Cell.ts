import { MazeCellType } from '../enums/MazeCellType';
import { Position } from './Position';

export type Cell = {
  type: MazeCellType;
  position: Position;
}