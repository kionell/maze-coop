import { useState } from "react";
import { useEffectOnce } from "react-use";
import { GameCompact } from "@common/interfaces/GameCompact";
import { browserService } from "@services/BrowserService";

export function useGameBrowser() {
  const [games, setGames] = useState<GameCompact[]>([]);

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