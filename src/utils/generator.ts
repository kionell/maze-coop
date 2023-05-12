enum MazeCellType {
  Wall,
  Hole,
  Solution,
  Exit,
}

enum MazeDirection {
  North,
  South,
  West,
  East,
}

/**
 * Generates a new maze.
 * @param width Width of the maze.
 * @param height Height of the maze.
 * @returns Generated maze in the form of a 2D array.
 */
export function generateMaze(rows: number, columns: number): number[][] {
  const maze = createNewMaze(rows, columns);

  const randomExitPoint = getRandomExitPoint(maze);
  
  carveExit(maze, randomExitPoint[1], randomExitPoint[0]);

  const randomStartPoint = getRandomStartPoint(maze);

  carvePassage(maze, randomStartPoint[1], randomStartPoint[0]);

  return maze;
}

function carveExit(maze: number[][], y: number, x: number): void {
  maze[y][x] = MazeCellType.Exit;
}

function carvePassage(maze: number[][], y: number, x: number): void {
  // Special case for 1x1 maze.
  if (maze.length === 3 && maze[0].length === 3) {
    maze[1][1] = MazeCellType.Hole;

    return;
  }
  
  // The 4 directions, we can go.
  const directions = getRandomMazeDirections();

  // Go through each direction inside the randomly filled vector.
  for (let i = directions.length - 1; i >= 0; i--) {
    if (directions[i] === MazeDirection.North) {
      // If it is possible to go north, then carve a passage and call the function again.
      if (y > 2 && maze[y - 2][x] === MazeCellType.Wall) {
        for (let j = 2; j >= 0; j--) {
          maze[y - 2 + j][x] = MazeCellType.Hole;
        }

        carvePassage(maze, y - 2, x);
      }

      continue;
    }
    
    if (directions[i] === MazeDirection.South) {
      // If it is possible to go south, then carve a passage and call the function again.
      if (y + 2 < maze.length - 1 && maze[y + 2][x] === MazeCellType.Wall) {
        for (let j = 2; j >= 0; j--) {
          maze[y + j][x] = MazeCellType.Hole;
        }

        carvePassage(maze, y + 2, x);
      }

      continue;
    }

    if (directions[i] === MazeDirection.West) {
      // If it is possible to go west, then carve a passage and call the function again.
      if (x > 2 && maze[y][x - 2] === MazeCellType.Wall) {
        for (let j = 2; j >= 0; j--) {
          maze[y][x - 2 + j] = MazeCellType.Hole;
        }

        carvePassage(maze, y, x - 2);
      }
      
      continue;
    }

    if (directions[i] === MazeDirection.East) {
      // If it is possible to go east, then carve a passage and call the function again.
      if (x + 2 < maze[0].length - 1 && maze[y][x + 2] === MazeCellType.Wall) {
        for (let j = 2; j >= 0; j--) {
          maze[y][x + j] = MazeCellType.Hole;
        }

        carvePassage(maze, y, x + 2);
      }

      continue;
    }
  }
}

function createNewMaze(rows: number, columns: number): number[][] {
  return new Array(rows * 2 + 1)
    .fill(null)
    .map(() => new Array(columns * 2 + 1).fill(MazeCellType.Wall));
}

function getRandomMazeDirections(): MazeDirection[] {
  const directions = [
    MazeDirection.North,
    MazeDirection.South,
    MazeDirection.West,
    MazeDirection.East,
  ];

  shuffleArray(directions);

  return directions;
}

function getRandomMazeDirection(): MazeDirection {
  const randomDirections = getRandomMazeDirections();
  const randomIndex = Math.floor(Math.random() * randomDirections.length);
  
  return randomDirections[randomIndex]; 
}

function shuffleArray(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStartPoint(maze: number[][]): [number, number] {
  return [
    Math.trunc(getRandomInt(1, maze[0].length - 2) / 2) * 2 + 1,
    Math.trunc(getRandomInt(1, maze.length - 2) / 2) * 2 + 1,
  ];
}

function getRandomExitPoint(maze: number[][]): [number, number] {
  const direction = getRandomMazeDirection();
  const exitVariant = Math.round(Math.random());

  const startX = 0;
  const endX = maze[0].length - 1;

  const startY = 0;
  const endY = maze.length - 1;

  switch (direction) {
    case MazeDirection.North:
      return exitVariant ? [startX + 1, startY] : [endX - 1, startY];

    case MazeDirection.South:
      return exitVariant ? [startX + 1, endY] : [endX - 1, endY];

    case MazeDirection.West:
      return exitVariant ? [startX, startY + 1] : [startX, endY - 1];

    case MazeDirection.East:
      return exitVariant ? [endX, startY + 1] : [endX, endY - 1];
  }
}
