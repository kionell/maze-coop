import { useEffectOnce } from "react-use";
import { gameService } from "@services/GameService";
import { useGameContext } from "./useGameContext";

export function usePlayerListUpdate() {
  const gameState = useGameContext();

  useEffectOnce(() => {    
    gameService.onStart(({ data }) => {
      gameService.offStart();
      gameService.offJoin();
      gameState.set(data);
    });

    gameService.onCancel(() => {
      gameState.set(null);
    });

    gameService.onLeave(({ data }) => {
      gameState.set(data);
    });

    gameService.onJoin(({ data }) => {
      if (data.memberCount === data.config.maxPlayers) {
        return gameService.start(data.id);
      }

      gameState.set(data);
    });

    return () => {
      gameService.offCancel();
      gameService.offLeave();
    };
  });
}