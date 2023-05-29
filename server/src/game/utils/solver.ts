import { MazeCellType } from '../enums/MazeCellType';
import { Maze } from '../types/Maze';
import { Point } from '../types/Point';
import { BFS } from './bfs';
import { findExitPoint } from './maze';

/**
 * Calculates distance from entry point to exit using BFS algorithm.
 * @param maze 2D array of maze layout.
 * @param entry Entry point.
 * @returns Distance from entry point to exit.
 */
export function getDistanceToExit(maze: Maze, entry: Point): number {
  const exit = findExitPoint(maze);

  let maxDistance = -1;

  for (const { distance } of BFS(maze, entry, exit)) {
    maxDistance = Math.max(maxDistance, distance);
  }

  return maxDistance;
}

/**
 * Solves the maze using BFS algorithm. Mutates the array.
 * @param maze 2D array of maze layout.
 * @param entry Entry point.
 */
export function solveMaze(maze: Maze, entry: Point) {
  const exit = findExitPoint(maze);

  for (const { position, distance } of BFS(maze, entry, exit)) {
    if (position.x !== exit.x || position.y !== exit.y) {
      maze[position.y][position.x] = -distance;
    }
  }

  // Walk back from the exit to the entrance.
  let { x, y } = exit;
  let distance = maze[y][x];

  // Loop until we aren't at the beginning.
  while (distance < 0) {
    // Mark everything as a solution on the way.
    maze[y][x] = MazeCellType.Solution;
    distance++;

    if (y > 0 && maze[y - 1][x] === distance) {
      y--;
    } else if (y + 1 < maze.length && maze[y + 1][x] === distance) {
      y++;
    } else if (x > 0 && maze[y][x - 1] === distance) {
      x--;
    } else if (x + 1 < maze[0].length && maze[y][x + 1] === distance) {
      x++;
    }
  }

  cleanMaze(maze);
}

/**
 * Removes temporary values from the maze array.
 * @param maze 2D array of maze layout.
 */
function cleanMaze(maze: Maze): void {
  // Clean up, the output shall only contain walls, holes or solutions.
  for (let y = maze.length - 1; y >= 0; y--) {
    for (let x = maze[y].length - 1; x >= 0; x--) {
      const isWall = maze[y][x] === MazeCellType.Wall;
      const isSolution = maze[y][x] !== MazeCellType.Solution;

      if (!isWall && !isSolution) {
        maze[y][x] = MazeCellType.Hole;
      }
    }
  }
}
