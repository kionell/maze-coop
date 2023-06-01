import { Injectable } from '@nestjs/common';
import { GameConfig } from '@common/interfaces/GameConfig';
import { Point } from '@common/types/Point';
import { DistancePoint } from '@common/types/DistancePoint';
import { DistanceSpreadRange } from '@common/types/DistanceSpreadRange';
import { Maze } from '@common/types/Maze';
import { BFS } from '../utils/bfs';
import { findExitPoint } from '../utils/maze';

@Injectable()
export class PlayerGenerator {
  /**
   * Generates random spawn points using BFS algorithm.
   * All spawn points are generated on relatively close distance from the exit.
   * @param maze 2D array of maze layout.
   * @param config Game config.
   * @returns Generated spawn points.
   */
  generate(maze: Maze, config: GameConfig): Point[] {
    const spawnPoints: Point[] = [];
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
      if (pointHistory.length > 0 && pointHistory.length < config.maxPlayers) {
        // Populate history with points that are relatively close to the first one.
        if (this.atRightDistance(pointHistory, distancePoint, config)) {
          pointHistory.push(distancePoint);
        }
      }

      // When there are enough points in history we can update
      // all spawn points to keep them relatively close.
      if (pointHistory.length === config.maxPlayers) {
        for (let i = 0; i < pointHistory.length; i++) {
          spawnPoints[i] = pointHistory[i].position;
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
    while (spawnPoints.length < config.maxPlayers) {
      const randomIndex = Math.floor(Math.random() * pointHistory.length);

      spawnPoints.push(pointHistory[randomIndex].position);
    }

    return spawnPoints;
  }

  private atRightDistance(
    points: DistancePoint[],
    point: DistancePoint,
    config: GameConfig,
  ): boolean {
    if (!points.length) return true;

    const spreadRange = this.getDistanceSpreadRange(points, config);

    for (let i = points.length - 1; i >= 0; i--) {
      const distance = Math.abs(points[i].distance - point.distance);

      if (distance < spreadRange.min || distance > spreadRange.max) {
        return false;
      }
    }

    return true;
  }

  private getDistanceSpreadRange(points: DistancePoint[], config: GameConfig) {
    let min = 0;
    let max = 0;

    if (config.maxSpread === 'auto' || config.maxSpread <= 0) {
      const maxDistanceToExit = points.reduce((p, c) => Math.max(p, c.distance), 0);

      min = Math.sqrt(maxDistanceToExit);
      max = config.maxPlayers * min;
    } else {
      max = config.maxSpread;
      min = max / config.maxPlayers;
    }

    return { min, max } as DistanceSpreadRange;
  }
}
