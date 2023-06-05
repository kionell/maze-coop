import { useEffect, useRef } from "react";
import { useMazeUpdate } from "./useMazeUpdate";
import { useGameContext } from "./useGameContext";
import { MazeCellType } from "../../../common/enums/MazeCellType";

export function useMazeDraw(cb: (source: HTMLCanvasElement) => void) {
  const gameState = useGameContext();
  const [maze, position] = useMazeUpdate();

  const canvasRef = useRef(document.createElement('canvas'));
  const contextRef = useRef(canvasRef.current.getContext('2d')!);

  useEffect(() => {
    if (!gameState.info || !gameState.state || !maze.length) {
      return;
    }

    const width = gameState.info.config.columns * 2 + 1;
    const height = gameState.info.config.rows * 2 + 1;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    contextRef.current.imageSmoothingEnabled = false;

    const getColor = (type: MazeCellType) => {
      switch (type) {
        case MazeCellType.Wall: return '#000000';
        case MazeCellType.Hole: return '#FFFFFF';
        case MazeCellType.Exit: return '#00FF00';
      }

      return '#444444';
    }

    for (let y = height - 1; y >= 0; y--) {
      for (let x = width - 1; x >= 0; x--) {
        contextRef.current.fillStyle = getColor(maze[y][x]);
        contextRef.current.fillRect(x, y, 1, 1);   
      }
    }

    contextRef.current.fillStyle = gameState.state.member.color;
    contextRef.current.fillRect(position.x, position.y, 1, 1);

    cb(canvasRef.current);
  }, [maze, position, gameState, cb]);
}