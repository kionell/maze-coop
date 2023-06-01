import { useEffectOnce } from "react-use";
import { gameService } from "@services/GameService";
import { useGameContext } from "./useGameContext";

export function useGameCancelListener() {
  const gameState = useGameContext();

  useEffectOnce(() => {
    gameService.onCancel(() => {
      gameState.set(null)
    });

    return () => gameService.offCancel();
  });
}