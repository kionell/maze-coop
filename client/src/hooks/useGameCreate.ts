import { useEffectOnce } from 'react-use';
import { useGameContext } from './useGameContext';
import { gameService } from '@services/GameService';

export function useGameCreate() {
  const gameState = useGameContext();

  useEffectOnce(() => {    
    gameService.onCreate(({ data }) => {
      gameService.offCreate();
      gameState.setInfo(data);
    });
  });
}