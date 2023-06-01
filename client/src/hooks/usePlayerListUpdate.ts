import { useEffectOnce } from "react-use";
import { gameService } from "@services/GameService";
import { useGameContext } from "./useGameContext";
import { useUserContext } from "./useUserContext";

export function usePlayerListUpdate() {
  const userState = useUserContext();
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
        // Only host can emit game start event.
        if (userState.value?.id === data.metadata.hostId) {
          return gameService.start(data.id);
        }
      }
      else { 
        gameState.set(data);
      }
    });

    return () => {
      gameService.offCancel();
      gameService.offLeave();
    };
  });
}