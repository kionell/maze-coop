import { MazeDirection } from '@common/enums/MazeDirection';
import { Point } from '@common/types/Point';
import { Maze } from '@common/types/Maze';

export function generateRandomMazeDirections(): MazeDirection[] {
  const directions = [
    MazeDirection.North,
    MazeDirection.South,
    MazeDirection.West,
    MazeDirection.East,
  ];

  shuffleArray(directions);

  return directions;
}

export function generateRandomMazeDirection(): MazeDirection {
  const randomDirections = generateRandomMazeDirections();
  const randomIndex = Math.floor(Math.random() * randomDirections.length);

  return randomDirections[randomIndex];
}

export function generateRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomCarvePoint(maze: number[][]): Point {
  return {
    x: Math.trunc(generateRandomInt(1, maze[0].length - 2) / 2) * 2 + 1,
    y: Math.trunc(generateRandomInt(1, maze.length - 2) / 2) * 2 + 1,
  };
}

export function generateRandomExitPoint(maze: Maze): Point {
  const direction = generateRandomMazeDirection();
  const exitVariant = Math.round(Math.random());

  const startX = 0;
  const endX = maze[0].length - 1;

  const startY = 0;
  const endY = maze.length - 1;

  switch (direction) {
    case MazeDirection.North:
      return exitVariant ? { x: startX + 1, y: startY } : { x: endX - 1, y: startY };

    case MazeDirection.South:
      return exitVariant ? { x: startX + 1, y: endY } : { x: endX - 1, y: endY };

    case MazeDirection.West:
      return exitVariant ? { x: startX, y: startY + 1 } : { x: startX, y: endY - 1 };

    case MazeDirection.East:
      return exitVariant ? { x: endX, y: startY + 1 } : { x: endX, y: endY - 1 };
  }
}

function shuffleArray(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}
