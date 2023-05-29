import { MazeCellType } from '../enums/MazeCellType';
import { Maze } from '../types/Maze';
import { Point } from '../types/Point';

export function findExitPoint(maze: number[][]): Point {
  const exitPoint: Point = { x: -1, y: -1 };
  const bottomEdgeIndex = maze.length - 1;

  for (let y = bottomEdgeIndex; y >= 0; y--) {
    const rightEdgeIndex = maze[0].length - 1;

    if (y !== 0 && y !== bottomEdgeIndex) {
      if (maze[y][0] === MazeCellType.Exit) {
        exitPoint.x = 0;
        exitPoint.y = y;

        return exitPoint;
      }

      if (maze[y][rightEdgeIndex] === MazeCellType.Exit) {
        exitPoint.x = rightEdgeIndex;
        exitPoint.y = y;

        return exitPoint;
      }

      continue;
    }

    for (let x = rightEdgeIndex; x >= 0; x--) {
      if (maze[y][x] === MazeCellType.Exit) {
        exitPoint.x = x;
        exitPoint.y = y;

        return exitPoint;
      }
    }
  }

  return exitPoint;
}

export function printMaze(maze: Maze): void {
  for (let y = 0; y < maze.length; y++) {
    let string = '[';

    for (let x = 0; x < maze[y].length; x++) {
      string += maze[y][x].toString().padStart(4, ' ').padEnd(6, ' ');
    }

    string += ']';

    console.log(string);
  }
}
