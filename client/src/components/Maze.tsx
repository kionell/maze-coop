import { useEffect, useRef } from 'react';
import styles from '../styles/Maze.module.css';
import { generateMaze } from '../../../server/src/game/utils/generator';
import { generateRandomSpawnPoints } from '../../../server/src/game/utils/players';
import { Maze } from '../../../server/src/game/types/Maze';
import { DistancePoint } from '../../../server/src/game/types/DistancePoint';

interface IMazeProps {
  players: number;
  rows: number;
  columns: number;
}

const Maze: React.FC<IMazeProps> = ({ players, rows, columns }) => {
  const hiddenRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hiddenRef.current || !displayRef.current) return;
    
    let maze: Maze;
    let spawnPoints: DistancePoint[];

    const updateMaze = () => {
      maze = generateMaze(rows, columns);
      spawnPoints = generateRandomSpawnPoints(maze, players);

      drawMaze();
    }

    const drawMaze = () => {
      if (!hiddenRef.current || !displayRef.current) return;

      const width = maze[0].length;
      const height = maze.length;
      const pixelSize = 25;

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
  
      const colors = ['#FFBB00', '#AAFFEE', '#BC33FD', '#DD6644', '#6a83c7', '#005eff', '#ee6e9a', '#00DDee'];

      spawnPoints.forEach((point, i) => {
        const randomColorIndex = Math.floor(Math.random() * colors.length);

        hiddenContext.fillStyle = colors[randomColorIndex];
        hiddenContext.fillRect(point.position.x, point.position.y, 1, 1);

        console.log(`Player ${i + 1}: Spawn = {${point.position.x}, ${point.position.y}} | Distance = ${point.distance}`);
      });

      displayContext.drawImage(hiddenRef.current, 0, 0, width, height, 0, 0, width * pixelSize, height * pixelSize);
    }

    const onKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'KeyR') updateMaze();
    };

    document.addEventListener('keypress', onKeyPress);

    updateMaze();

    return () => {
      document.removeEventListener('keypress', onKeyPress);
    }
  }, [players, rows, columns]);

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