import { useRef } from 'react';
import { useMazeDraw } from '../hooks/useMazeDraw';
import styles from '@styles/Maze.module.css';

const Maze: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useMazeDraw((source) => {
    if (!canvasRef.current) return;

    const scale = 25;

    const sw = source.width;
    const sh = source.height;
    const dw = sw * scale;
    const dh = sh * scale;

    if (!contextRef.current) {
      canvasRef.current.width = source.width * scale;
      canvasRef.current.height = source.height * scale;

      contextRef.current = canvasRef.current.getContext('2d')!;
      contextRef.current.imageSmoothingEnabled = false;
    }

    contextRef.current.drawImage(source, 0, 0, sw, sh, 0, 0, dw, dh);
  });

  return (
    <div className={styles.canvas_area}>
      <canvas 
        className={`${styles.display_canvas} ${styles.canvases}`}
        ref={canvasRef}
      />
    </div>
  );
}

export default Maze;