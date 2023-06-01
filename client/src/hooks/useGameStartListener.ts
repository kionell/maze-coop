import { useEffectOnce } from "react-use";
import { gameService } from "@services/GameService";
import { useGameContext } from "./useGameContext";

export function useGameStartListener() {
  const gameState = useGameContext();

  useEffectOnce(() => {
    gameService.onStart((message) => {
      gameState.set(message.data);
    });

    return () => gameService.offStart();
  });
}