import { useState } from 'react';
import { useInterval } from 'react-use';

export function useReadableTimeInterval(start?: number): string {
  const [time, setTime] = useState<string>('0 seconds');

  useInterval(() => {
    if (!start) return;

    const time = Date.now() - start;
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
  
    setTime(result.join(', '));
  }, 1000);

  return time;
}