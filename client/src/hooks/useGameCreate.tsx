import { useEffectOnce } from 'react-use';
import { gameService } from '@services/GameService';
import { useGameContext } from './useGameContext';

export function useGameCreate() {
  const gameState = useGameContext();

  useEffectOnce(() => {    
    gameService.onCreate(({ data }) => {
      gameService.offCreate();
      gameState.setInfo(data);

      // This is a special case when user wants to play solo.
      if (data.members.count === data.config.maxPlayers) {
        gameService.start(data.id);
      }
    });
  });
}