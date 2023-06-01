import { Color } from '../types/Color';
import { Maze } from '../types/Maze';
import { Point } from '../types/Point';

export interface GameLayout {
  maze: Maze;
  spawnPoints: Point[];
  colors: Color[];
}