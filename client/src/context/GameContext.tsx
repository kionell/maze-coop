import { 
  createContext, 
  useState,
  ReactNode,
} from "react";

type GameContextDefaultValue = {
  value: boolean;
  set: (isPlaying: boolean) => void;
};

export const GameContext = createContext<GameContextDefaultValue>({
  value: false,
  set: () => {},
});

interface IGameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: IGameProviderProps) {
  const [state, setState] = useState(false);

  return (
    <GameContext.Provider value={{ value: state, set: setState }}>
      {children}
    </GameContext.Provider>
  );
} 