import { Point } from '../types/Point';
import { DistancePoint } from '../types/DistancePoint';
import { Maze } from '../types/Maze';
import { MazeCellType } from '../enums/MazeCellType';

/**
 * Searches for the shortest path in the maze between two points using BFS.
 * If the end point is not specified, algorithm continues its work until all holes are visited.
 * All processed points are yielded using generator syntax.
 * @param maze 2D array of maze layout.
 * @param start Start point.
 * @param end End point.
 * @yields Current distance point.
 */
export function* BFS(maze: Maze, start: Point, end?: Point): Generator<DistancePoint> {
  const pointQueue: Point[] = [start];
  const visited = createVisitedArray(maze);

  let distance = -1;
  let deadend = true;

  const isNotVisitedHole = (y: number, x: number): boolean => {
    return (maze[y][x] & MazeCellType.Hole) > 0 && !visited[y][x];
  };

  // Walk away from the entrace and save their distance (from the entrance).
  while (pointQueue.length) {
    distance++;

    for (let i = pointQueue.length - 1; i >= 0; i--) {
      const position = pointQueue.shift() as Point;
      const { x, y } = position;

      deadend = true;

      if (!visited[y][x]) visited[y][x] = true;

      // If north is a hole, then save.
      if (y > 0 && isNotVisitedHole(y - 1, x)) {
        pointQueue.push({ y: y - 1, x });
        deadend = false;
      }

      // If south is a hole, then save.
      if (y < maze.length - 1 && isNotVisitedHole(y + 1, x)) {
        pointQueue.push({ y: y + 1, x });
        deadend = false;
      }

      // If west is a hole, then save.
      if (x > 0 && isNotVisitedHole(y, x - 1)) {
        pointQueue.push({ y, x: x - 1 });
        deadend = false;
      }

      // If east is a hole, then save.
      if (x < maze[0].length - 1 && isNotVisitedHole(y, x + 1)) {
        pointQueue.push({ y, x: x + 1 });
        deadend = false;
      }

      yield { position, distance, deadend } as DistancePoint;

      // Stop at the end.
      // It could run and check every cell in the maze,
      // but it would be waste of time.
      if (end && y === end.y && x === end.x) {
        return;
      }
    }
  }
}

function createVisitedArray(maze: Maze): boolean[][] {
  return new Array(maze.length)
    .fill(null)
    .map(() => new Array(maze[0].length).fill(false));
}
