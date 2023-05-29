import { 
  createContext, 
  useState,
  ReactNode,
} from "react";

type GameContextDefaultValue = {
  value: boolean;
  update: (isPlaying: boolean) => void;
};

export const GameContext = createContext<GameContextDefaultValue>({
  value: false,
  update: () => {},
});

interface IGameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: IGameProviderProps) {
  const [state, setState] = useState(false);

  return (
    <GameContext.Provider value={{ value: state, update: setState }}>
      {children}
    </GameContext.Provider>
  );
} 