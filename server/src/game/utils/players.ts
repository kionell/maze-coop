import { DistancePoint } from '../types/DistancePoint';
import { DistanceSpreadRange } from '../types/DistanceSpreadRange';
import { Maze } from '../types/Maze';
import { BFS } from './bfs';
import { findExitPoint } from './maze';

/**
 * Generates random spawn points using BFS algorithm.
 * All spawn points are generated on relatively close distance from the exit.
 * @param maze 2D array of maze layout.
 * @param maxPoints How many spawn points should be generated.
 * @param maxSpread Max distance spread between each point.
 * @returns Generated spawn points.
 */
export function generateRandomSpawnPoints(maze: Maze, maxPoints = 2, maxSpread?: number) {
  const spawnPoints: DistancePoint[] = [];
  const pointHistory: DistancePoint[] = [];

  const exitPoint = findExitPoint(maze);

  for (const distancePoint of BFS(maze, exitPoint)) {
    const { position, deadend } = distancePoint;

    // Make sure we will not spawn players at the exit point.
    if (position.x === exitPoint.x && position.y === exitPoint.y) {
      continue;
    }

    // Here we check our point history for the presence of at least one point.
    // Our first point is always a key point and is located in a dead end.
    // Populate history with points that are relatively close to the first one.
    if (pointHistory.length > 0 && pointHistory.length < maxPoints) {
      if (atRightDistance(pointHistory, distancePoint, maxPoints, maxSpread)) {
        pointHistory.push(distancePoint);
      }
    }

    // When there are enough points in history we can update
    // all spawn points to keep them relatively close.
    if (pointHistory.length === maxPoints) {
      for (let i = 0; i < pointHistory.length; i++) {
        spawnPoints[i] = pointHistory[i];
      }
    }

    if (!deadend) continue;

    // At least one of the players will always be spawned in a dead end.
    // On each dead end we will reset point history.
    pointHistory.length = 0;
    pointHistory.push(distancePoint);
  }

  // In case the point history was not full enough when the last distance point was reached
  // Add missing spawn points by randomly copying existing ones.
  while (spawnPoints.length < maxPoints) {
    const randomIndex = Math.floor(Math.random() * pointHistory.length);

    spawnPoints.push(pointHistory[randomIndex]);
  }

  return spawnPoints;
}

function atRightDistance(
  spawnPoints: DistancePoint[],
  spawnPoint: DistancePoint,
  maxPoints: number,
  maxSpread?: number,
): boolean {
  if (!spawnPoints.length) return true;

  const spreadRange = getDistanceSpreadRange(spawnPoints, maxPoints, maxSpread);

  console.log(`Distance spread range: ${spreadRange.min} - ${spreadRange.max}`);

  for (let i = spawnPoints.length - 1; i >= 0; i--) {
    const distance = Math.abs(spawnPoints[i].distance - spawnPoint.distance);

    if (distance < spreadRange.min || distance > spreadRange.max) {
      return false;
    }
  }

  return true;
}

function getDistanceSpreadRange(
  points: DistancePoint[],
  maxPoints: number,
  maxSpread?: number,
) {
  let min = 0;
  let max = 0;

  if (!maxSpread) {
    const maxDistanceToExit = points.reduce((p, c) => Math.max(p, c.distance), 0);

    min = Math.sqrt(maxDistanceToExit);
    max = maxPoints * min;
  } else {
    max = maxSpread;
    min = max / maxPoints;
  }

  return { min, max } as DistanceSpreadRange;
}
