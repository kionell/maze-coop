import { Point } from './Point';

export type DistancePoint = {
  position: Point;
  distance: number;
  deadend: boolean;
};
