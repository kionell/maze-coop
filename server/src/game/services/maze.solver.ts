import { Injectable } from '@nestjs/common';
import { MazeCellType } from '@common/enums/MazeCellType';
import { Maze } from '@common/types/Maze';
import { Point } from '@common/types/Point';
import { BFS } from '../utils/bfs';
import { findExitPoint } from '../utils/maze';

@Injectable()
export class MazeSolver {
  /**
   * Calculates distance from entry point to exit using BFS algorithm.
   * @param maze 2D array of maze layout.
   * @param entry Entry point.
   * @returns Distance from entry point to exit.
   */
  getDistanceToExit(maze: Maze, entry: Point): number {
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
  solve(maze: Maze, entry: Point) {
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

    this.cleanMaze(maze);
  }

  /**
   * Removes temporary values from the maze array.
   * @param maze 2D array of maze layout.
   */
  private cleanMaze(maze: Maze): void {
    // Clean up, the output shall only contain walls, holes or solutions.
    for (let y = maze.length - 1; y >= 0; y--) {
      for (let x = maze[y].length - 1; x >= 0; x--) {
        const isWall = maze[y][x] === MazeCellType.Wall;
        const isSolution = maze[y][x] === MazeCellType.Solution;

        if (isWall || isSolution) continue;

        maze[y][x] = MazeCellType.Hole;
      }
    }
  }
}
