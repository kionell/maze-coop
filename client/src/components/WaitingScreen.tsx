import { useReadableTimeInterval } from '@hooks/useReadableTimeInterval';
import { useGameStartListener } from '@hooks/useGameStartListener';
import { useGameContext } from '@hooks/useGameContext';
import styles from '@styles/Dashboard.module.css';

const WaitingScreen: React.FC = () => {
  const gameState = useGameContext();

  const createdAt = gameState.value?.metadata.createdAt;
  const currentPlayers = gameState.value?.members.length ?? 0;
  const totalPlayers = gameState.value?.config.maxPlayers ?? 0;
  
  const passedTime = useReadableTimeInterval(createdAt);
  
  useGameStartListener();

  return (
    <div className={styles.dashboard_container}>
      <span>The game was created { passedTime } ago.</span>
      <span>Waiting for others players... ({currentPlayers} / {totalPlayers})</span>
    </div>
  );
}

export default WaitingScreen;
