enum MazeCellType {
  Wall,
  Hole,
  Solution,
  Exit,
}

export function solveMaze(
  maze: number[][],
  startY: number,
  startX: number,
): void {
  // error_check(maze, entrance_y, entrance_x, exitY, exitX);

  const distances: { x: number; y: number }[] = [];

  let distanceCount = 0;

  distances.push({
    x: startX,
    y: startY,
  });

  let newDistance = true;

  let y = 0;
  let x = 0;

  const [exitX, exitY] = findExitPoint(maze);

  /* Walk away from the entrace and save their distance (from the entrance). */
  while (newDistance) {
    newDistance = false;

    const distanceMax = distances.length;

    distanceCount--;

    // With the for loop, we can walk "parellel".
    // If there are 2 path, then there'll 2 elements in the mazeor, if there are 3, then 3, etc..
    for (let i = 0; i < distanceMax; i++) {
      y = distances[0].y;
      x = distances[0].x;

      maze[y][x] = distanceCount;

      // If north is a hole, then save.
      if (y > 0 && isNotVisitedHole(maze[y - 1][x])) {
        distances.push({ y: y - 1, x });
        newDistance = true;
      }

      // If south is a hole, then save.
      if (y + 1 < maze.length && isNotVisitedHole(maze[y + 1][x])) {
        distances.push({ y: y + 1, x });
        newDistance = true;
      }

      // If west is a hole, then save.
      if (x > 0 && isNotVisitedHole(maze[y][x - 1])) {
        distances.push({ y, x: x - 1 });
        newDistance = true;
      }

      // If east is a hole, then save.
      if (x + 1 < maze[0].length && isNotVisitedHole(maze[y][x + 1])) {
        distances.push({ y, x: x + 1 });
        newDistance = true;
      }

      /* Stop at the end. It could run and check every cell in the maze, but it would be waste of time. */
      if (y === exitY && x === exitX) {
        newDistance = false;
        break;
      }

      distances.shift();
    }
  }

  // Walk back from the exit to the entrance.
  y = exitY;
  x = exitX;
  distanceCount = maze[y][x];

  // Loop until we aren't at the beginning.
  while (distanceCount < 0) {
    // Mark everything as a solution on the way.
    maze[y][x] = MazeCellType.Solution;

    distanceCount++;

    if (y > 0 && maze[y - 1][x] === distanceCount) {
      y--;
    } else if (y + 1 < maze.length && maze[y + 1][x] === distanceCount) {
      y++;
    } else if (x > 0 && maze[y][x - 1] === distanceCount) {
      x--;
    } else if (x + 1 < maze[0].length && maze[y][x + 1] === distanceCount) {
      x++;
    }
  }

  // Clean up, the output shall only contain walls, holes or solutions.
  for (let y = maze.length - 1; y >= 0; y--) {
    for (let x = maze[y].length - 1; x >= 0; x--) {
      if (
        maze[y][x] !== MazeCellType.Wall &&
        maze[y][x] !== MazeCellType.Solution
      ) {
        maze[y][x] = MazeCellType.Hole;
      }
    }
  }
}

function findExitPoint(maze: number[][]): [number, number] {
  let exitX = -1;
  let exitY = -1;

  for (let y = maze.length - 1; y >= 0; y--) {
    for (let x = maze[y].length - 1; x >= 0; x--) {
      if (maze[y][x] === 3) {
        exitX = x;
        exitY = y;
      }
    }
  }

  return [exitX, exitY];
}

function isNotVisitedHole(value: number): boolean {
  return value > 0 && (value & MazeCellType.Hole) > 0;
}
