import { useState } from 'react';
import { useInterval } from 'react-use';
import { useGameContext } from './useGameContext';

export function useReadableTimeInterval(): string {
  const gameState = useGameContext();

  const [time, setTime] = useState<string>(getUpdatedTime());

  function getUpdatedTime(): string {
    if (!gameState.info) return '0 seconds';

    const time = Date.now() - gameState.info.metadata.createdAt;
    const seconds = Math.trunc(time / 1000) % 60;
    const minutes = Math.trunc(time / 60000) % 60;
    const hours = Math.trunc(time / 3600000) % 24;
  
    const result: string[] = [];
  
    if (hours && result.length < 3) {
      result.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }
  
    if (minutes && result.length < 3) {
      result.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
  
    if (result.length < 3) {
      result.push(`${seconds ?? 0} second${seconds !== 1 ? 's' : ''}`);
    }
  
    return result.join(', ');
  }

  useInterval(() => setTime(getUpdatedTime()), 1000);

  return time;
}