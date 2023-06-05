import { useEffectOnce } from 'react-use';
import { useGameContext } from './useGameContext';
import { gameService } from '@services/GameService';

export function useGameConnect() {
  const gameState = useGameContext();

  useEffectOnce(() => {    
    gameService.onConnect(({ data }) => {
      gameService.offConnect();
      gameState.setInfo(data);
    });
  });
}