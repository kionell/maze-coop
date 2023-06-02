import { useRef } from 'react';
import styles from '../styles/Maze.module.css';
import { useGameContext } from '../hooks/useGameContext';
import { useEffectOnce } from 'react-use';

const Maze: React.FC = () => {
  const gameState = useGameContext();

  const hiddenRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);

  useEffectOnce(() => {
    if (!hiddenRef.current || !displayRef.current || !gameState.info || !gameState.state) return;

    console.log(gameState.state);

    const width = gameState.info.config.columns * 2 + 1;
    const height = gameState.info.config.rows * 2 + 1;
    const pixelSize = 25;

    hiddenRef.current.width = width;
    hiddenRef.current.height = height;

    displayRef.current.width = width * pixelSize;
    displayRef.current.height = height * pixelSize;

    const hiddenContext = hiddenRef.current.getContext('2d') as CanvasRenderingContext2D;
    const displayContext = displayRef.current.getContext('2d') as CanvasRenderingContext2D;

    hiddenContext.imageSmoothingEnabled = false;
    displayContext.imageSmoothingEnabled = false;

    hiddenContext.fillStyle = 'white';
    hiddenContext.fillRect(0, 0, width, height);

    hiddenContext.fillStyle = gameState.state.member.color;
    hiddenContext.fillRect(gameState.state.position.x, gameState.state.position.y, 1, 1);

    displayContext.drawImage(hiddenRef.current, 0, 0, width, height, 0, 0, width * pixelSize, height * pixelSize);
  });

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