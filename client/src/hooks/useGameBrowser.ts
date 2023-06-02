import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { GameInfo } from '@common/interfaces/GameInfo';
import { browserService } from '@services/BrowserService';

export function useGameBrowser() {
  const [games, setGames] = useState<GameInfo[]>([]);

  useEffectOnce(() => {
    browserService.onUpdate((message) => {
      setGames(message.data);
    });

    browserService.browse();

    return () => {
      browserService.offUpdate();
    };
  });

  return games;
}