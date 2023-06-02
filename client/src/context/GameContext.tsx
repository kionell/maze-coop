import { 
  createContext, 
  useState,
  ReactNode,
} from 'react';

import { GameCompact } from "@common/interfaces/GameCompact";
import { browserService } from '@services/BrowserService';
import { gameService } from '@services/GameService';

type GameContextDefaultValue = {
  value: GameCompact | null;
  set: (game: GameCompact | null) => void;
};

export const GameContext = createContext<GameContextDefaultValue>({
  value: null,
  set: () => {},
});

interface IGameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: IGameProviderProps) {
  const [state, setState] = useState<GameCompact | null>(null);

  const setGame = async (game: GameCompact | null) => {
    if (state === game) return;

    const service = game !== null ? browserService : gameService;

    await service.disconnect();

    setState(game);
    console.log(game);
  }

  return (
    <GameContext.Provider value={{ value: state, set: setGame }}>
      {children}
    </GameContext.Provider>
  );
} 