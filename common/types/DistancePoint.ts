import { Position } from './Position';

export type DistancePoint = {
  position: Position;
  distance: number;
  deadend: boolean;
};
