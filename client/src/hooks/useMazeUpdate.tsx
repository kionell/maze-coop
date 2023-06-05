import { useEffect, useRef, useState } from 'react';
import { MazeCellType } from '@common/enums/MazeCellType';
import { Position } from '@common/types/Position';
import { Maze } from '@common/types/Maze';
import { gameService } from "../services/GameService";
import { useGameContext } from './useGameContext';

export function useMazeUpdate() {
  const gameState = useGameContext();
  const mazeRef = useRef<Maze>([]);
  const [position, setPosition] = useState<Position>({ x: -1, y: -1 });

  useEffect(() => {
    if (!gameState.info?.config) return;

    const width = gameState.info.config.columns * 2 + 1;
    const height = gameState.info.config.rows * 2 + 1;

    mazeRef.current = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(-1));

    setPosition({ x: -1, y: -1 });
  }, [gameState.info?.config]);

  useEffect(() => {
    if (!gameState.state?.position) return;

    setPosition(gameState.state.position);
  }, [gameState.state?.position]);

  const isBlockedCell = (y: number, x: number) => {
    const width = mazeRef.current[0].length - 1;
    const height = mazeRef.current.length - 1;

    if (x < 0 || x > width || y < 0 || y > height) {
      return false;
    }

    if (mazeRef.current[y][x] !== MazeCellType.Unknown) {
      return false;
    }

    if (x > 0 && mazeRef.current[y][x - 1] !== MazeCellType.Wall) {
      return false;
    }

    if (y > 0 && mazeRef.current[y - 1][x] !== MazeCellType.Wall) {
      return false;
    }

    if (x < width && mazeRef.current[y][x + 1] !== MazeCellType.Wall) {
      return false;
    }

    if (y < height && mazeRef.current[y + 1][x] !== MazeCellType.Wall) {
      return false;
    }

    return true;
  }

  gameService.onNextPosition(({ data }) => {
    const [oldPos, newPos] = [data.old.position, data.new.position];
    
    mazeRef.current[oldPos.y][oldPos.x] = data.old.type;
    mazeRef.current[newPos.y][newPos.x] = data.new.type;

    setPosition(data.new.type !== MazeCellType.Wall ? newPos : oldPos);

    // Sometimes corner cells can't be reached by players
    // We will show them once a player has revealed all surrounded walls.
    if (isBlockedCell(oldPos.y - 1, oldPos.x - 1)) {
      mazeRef.current[oldPos.y - 1][oldPos.x - 1] = MazeCellType.Wall;
    }

    if (isBlockedCell(oldPos.y - 1, oldPos.x + 1)) {
      mazeRef.current[oldPos.y - 1][oldPos.x + 1] = MazeCellType.Wall;
    }

    if (isBlockedCell(oldPos.y + 1, oldPos.x + 1)) {
      mazeRef.current[oldPos.y + 1][oldPos.x + 1] = MazeCellType.Wall;
    }

    if (isBlockedCell(oldPos.y + 1, oldPos.x - 1)) {
      mazeRef.current[oldPos.y + 1][oldPos.x - 1] = MazeCellType.Wall;
    }
  });

  return [mazeRef.current, position] as [Maze, Position];
}