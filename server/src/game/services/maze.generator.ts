import { Injectable } from '@nestjs/common';
import { MazeCellType } from '@common/enums/MazeCellType';
import { MazeDirection } from '@common/enums/MazeDirection';
import { GameConfig } from '@common/interfaces/GameConfig';
import { Maze } from '@common/types/Maze';

import {
  generateRandomCarvePoint,
  generateRandomExitPoint,
  generateRandomMazeDirections,
} from '../utils/random';

@Injectable()
export class MazeGenerator {
  /**
   * Generates a new maze.
   * @param config Game config.
   * @returns Generated maze in the form of a 2D array.
   */
  generate({ rows, columns }: GameConfig): Maze {
    const maze = this.create(rows, columns);

    const randomExitPoint = generateRandomExitPoint(maze);

    this.carveExit(maze, randomExitPoint.y, randomExitPoint.x);

    const randomCarvePoint = generateRandomCarvePoint(maze);

    this.carvePassage(maze, randomCarvePoint.y, randomCarvePoint.x);

    return maze;
  }

  private carveExit(maze: number[][], y: number, x: number): void {
    maze[y][x] = MazeCellType.Exit;
  }

  private carvePassage(maze: number[][], y: number, x: number): void {
    // Special case for 1x1 maze.
    if (maze.length === 3 && maze[0].length === 3) {
      maze[1][1] = MazeCellType.Hole;

      return;
    }

    // The 4 directions, we can go.
    const directions = generateRandomMazeDirections();

    // Go through each direction inside the randomly filled vector.
    for (let i = directions.length - 1; i >= 0; i--) {
      if (directions[i] === MazeDirection.North) {
        // If it is possible to go north, then carve a passage and call the function again.
        if (y > 2 && maze[y - 2][x] === MazeCellType.Wall) {
          for (let j = 2; j >= 0; j--) {
            maze[y - 2 + j][x] = MazeCellType.Hole;
          }

          this.carvePassage(maze, y - 2, x);
        }

        continue;
      }

      if (directions[i] === MazeDirection.South) {
        // If it is possible to go south, then carve a passage and call the function again.
        if (y + 2 < maze.length - 1 && maze[y + 2][x] === MazeCellType.Wall) {
          for (let j = 2; j >= 0; j--) {
            maze[y + j][x] = MazeCellType.Hole;
          }

          this.carvePassage(maze, y + 2, x);
        }

        continue;
      }

      if (directions[i] === MazeDirection.West) {
        // If it is possible to go west, then carve a passage and call the function again.
        if (x > 2 && maze[y][x - 2] === MazeCellType.Wall) {
          for (let j = 2; j >= 0; j--) {
            maze[y][x - 2 + j] = MazeCellType.Hole;
          }

          this.carvePassage(maze, y, x - 2);
        }

        continue;
      }

      if (directions[i] === MazeDirection.East) {
        // If it is possible to go east, then carve a passage and call the function again.
        if (x + 2 < maze[0].length - 1 && maze[y][x + 2] === MazeCellType.Wall) {
          for (let j = 2; j >= 0; j--) {
            maze[y][x + j] = MazeCellType.Hole;
          }

          this.carvePassage(maze, y, x + 2);
        }

        continue;
      }
    }
  }

  private create(rows: number, columns: number): Maze {
    return new Array(rows * 2 + 1)
      .fill(null)
      .map(() => new Array(columns * 2 + 1).fill(MazeCellType.Wall));
  }
}
