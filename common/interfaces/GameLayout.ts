import { Color } from '../types/Color';
import { Maze } from '../types/Maze';
import { Position } from '../types/Position';

export interface GameLayout {
  maze: Maze;
  startPositions: Position[];
  colors: Color[];
}