import { useEffect, useState } from 'react';
import { useGameContext } from './useGameContext';

export function useMemberCount() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  
  const gameState = useGameContext();

  useEffect(() => {
    if (!gameState.info) return;

    setCurrent(gameState.info.members.count);
    setTotal(gameState.info.config.maxPlayers);
  }, [gameState.info]);

  return [current, total];
}