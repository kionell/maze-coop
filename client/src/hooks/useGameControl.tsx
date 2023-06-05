import { useEffect } from "react";
import { useGameContext } from "./useGameContext";
import { gameService } from "../services/GameService";

export function useGameControl() {
  const gameState = useGameContext();

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (!gameState.state || !gameState.info) return;
      
      const message = {
        member: gameState.state.member,
        createdAt: Date.now(),
        gameId: gameState.info.id,
        type: 0,
      };

      if (event.code === 'KeyW') {
        gameService.move({ ...message, content: 'up' });
      }

      if (event.code === 'KeyS') {
        gameService.move({ ...message, content: 'down' });
      }

      if (event.code === 'KeyA') {
        gameService.move({ ...message, content: 'left' });
      }

      if (event.code === 'KeyD') {
        gameService.move({ ...message, content: 'right' });
      }
    };

    document.addEventListener('keypress', onKeyPress);

    return () => {
      gameService.offNextPosition();
      document.removeEventListener('keypress', onKeyPress);
    }
  }, [gameState]);
}