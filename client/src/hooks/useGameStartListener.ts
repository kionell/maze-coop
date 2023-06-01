import { useEffectOnce } from "react-use";
import { gameService } from "@services/GameService";
import { useGameContext } from "./useGameContext";

export function useGameStartListener() {
  const gameState = useGameContext();

  useEffectOnce(() => {
    gameService.onStart(({ data }) => {
      gameState.set(data);
    });

    gameService.onJoin(({ data }) => {
      if (data.members.length === data.config.maxPlayers) {
        gameService.start(data.metadata.hostId);
      }
      else {
        gameState.set(data);
      }
    });

    return () => {
      gameService.offStart();
      gameService.offJoin();
    }
  });
}