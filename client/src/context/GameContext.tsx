import { 
  createContext, 
  useState,
  ReactNode,
} from 'react';

import { GameInfo } from '@common/interfaces/GameInfo';
import { GameState } from '@common/interfaces/GameState';
import { browserService } from '@services/BrowserService';
import { gameService } from '@services/GameService';

type GameContextDefaultValue = {
  info: GameInfo | null;
  state: GameState | null;
  setInfo: (game: GameInfo | null) => void;
  setState: (state: GameState | null) => void;
};

export const GameContext = createContext<GameContextDefaultValue>({
  info: null,
  state: null,
  setInfo: () => {},
  setState: () => {},
});

interface IGameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: IGameProviderProps) {
  const [localInfo, setLocalInfo] = useState<GameInfo | null>(null);
  const [localState, setLocalState] = useState<GameState | null>(null);

  const setInfo = (info: GameInfo | null) => {
    if (localInfo === info) return;

    (info === null ? gameService : browserService).disconnect();

    setLocalInfo(info);
  }

  const setState = (state: GameState | null) => {
    if (localState === state) return;

    setLocalState(state);
  }

  return (
    <GameContext.Provider value={{ info: localInfo, state: localState, setInfo, setState }}>
      {children}
    </GameContext.Provider>
  );
} 