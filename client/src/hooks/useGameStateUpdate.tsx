import { useEffectOnce } from 'react-use';
import { gameService } from '@services/GameService';
import { useGameContext } from './useGameContext';
import { useUserContext } from './useUserContext';

export function useGameStateUpdate() {
  const userState = useUserContext();
  const gameState = useGameContext();

  useEffectOnce(() => {    
    gameService.onStart(({ data }) => {
      gameService.offStart();
      gameService.offJoin();
      gameState.setState(data);
    });

    gameService.onCancel(() => {
      gameState.setInfo(null);
      gameState.setState(null);
    });

    gameService.onJoin(({ data }) => {
      if (!userState.value || !gameState.info) return;

      const { config, metadata, id } = gameState.info;

      gameState.setInfo({ ...gameState.info, members: data });

      if (data.count === config.maxPlayers) {
        // Only host can emit game start event.
        userState.value.id === metadata.hostId && gameService.start(id);
      }
    });

    gameService.onLeave(({ data }) => {
      if (!gameState.info) return;

      gameState.setInfo({ ...gameState.info, members: data });
    });

    gameService.onNextTurn(({ data }) => {
      if (!gameState.state) return;

      gameState.setState({ ...gameState.state, turnIndex: data });
    });

    gameService.onNextPosition(({ data }) => {
      if (!gameState.state) return;

      const position = gameState.state.position;

      if (position.x === data.x && position.y === data.y) return;

      gameState.setState({ ...gameState.state, position: data });
    });

    return () => {
      gameService.offStart();
      gameService.offJoin();
      gameService.offCancel();
      gameService.offLeave();
    };
  });
}