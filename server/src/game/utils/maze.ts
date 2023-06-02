import { MazeCellType } from '@common/enums/MazeCellType';
import { Maze } from '@common/types/Maze';
import { Position } from '@common/types/Position';

export function findExitPosition(maze: number[][]): Position {
  const exitPosition: Position = { x: -1, y: -1 };
  const bottomEdgeIndex = maze.length - 1;

  for (let y = bottomEdgeIndex; y >= 0; y--) {
    const rightEdgeIndex = maze[0].length - 1;

    if (y !== 0 && y !== bottomEdgeIndex) {
      if (maze[y][0] === MazeCellType.Exit) {
        exitPosition.x = 0;
        exitPosition.y = y;

        return exitPosition;
      }

      if (maze[y][rightEdgeIndex] === MazeCellType.Exit) {
        exitPosition.x = rightEdgeIndex;
        exitPosition.y = y;

        return exitPosition;
      }

      continue;
    }

    for (let x = rightEdgeIndex; x >= 0; x--) {
      if (maze[y][x] === MazeCellType.Exit) {
        exitPosition.x = x;
        exitPosition.y = y;

        return exitPosition;
      }
    }
  }

  return exitPosition;
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
