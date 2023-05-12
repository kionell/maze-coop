import { useEffect, useRef } from 'react';
import styles from './Maze.module.css';
import { generateMaze } from '../../utils/generator';
import { solveMaze } from '../../utils/solver';

const Maze: React.FC = () => {
  const hiddenRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);

  
  useEffect(() => {
    if (!hiddenRef.current || !displayRef.current) return;
    
    let maze: number[][];

    const updateMaze = () => {
      maze = generateMaze(1, 1);
  
      drawMaze();
    }

    const finishMaze = () => {
      if (!maze) return;

      solveMaze(maze, 1, 1);
      drawMaze();
    }

    const drawMaze = () => {
      if (!hiddenRef.current || !displayRef.current) return;

      const width = maze[0].length;
      const height = maze.length;
      const pixelSize = 15;

      hiddenRef.current.width = width;
      hiddenRef.current.height = height;
  
      displayRef.current.width = width * pixelSize;
      displayRef.current.height = height * pixelSize;

      const hiddenContext = hiddenRef.current.getContext('2d') as CanvasRenderingContext2D;
      const displayContext = displayRef.current.getContext('2d') as CanvasRenderingContext2D;

      hiddenContext.imageSmoothingEnabled = false;
      displayContext.imageSmoothingEnabled = false;

      for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 0) {
            hiddenContext.fillStyle = '#000000';
          }
  
          if (maze[y][x] === 1) {
            hiddenContext.fillStyle = '#FFFFFF';
          }
  
          if (maze[y][x] === 2) {
            hiddenContext.fillStyle = '#FF0000';
          }
  
          if (maze[y][x] === 3) {
            hiddenContext.fillStyle = '#00FF00';
          }
  
          hiddenContext.fillRect(x, y, 1, 1);
        }
      }
  
      displayContext.drawImage(hiddenRef.current, 0, 0, width, height, 0, 0, width * pixelSize, height * pixelSize);
    }

    const onKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyR') updateMaze();
      if (event.code === 'KeyH') finishMaze();
    };

    document.addEventListener('keypress', onKeyPress);

    updateMaze();

    return () => {
      document.removeEventListener('keypress', onKeyPress);
    }
  }, []);

  return (
    <div className={styles.canvas_area}>
      <canvas 
        className={`${styles.hidden_canvas} ${styles.canvases}`}
        ref={hiddenRef}
      />

      <canvas 
        className={`${styles.display_canvas} ${styles.canvases}`}
        ref={displayRef}
      />
    </div>
  );
}

export default Maze;