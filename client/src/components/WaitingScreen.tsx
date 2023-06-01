import { useReadableTimeInterval } from '@hooks/useReadableTimeInterval';
import { useGameContext } from '@hooks/useGameContext';
import styles from '@styles/Dashboard.module.css';

const WaitingScreen: React.FC = () => {
  const gameState = useGameContext();

  const createdAt = gameState.value?.metadata.createdAt;
  const memberCount = gameState.value?.memberCount ?? 0;
  const totalMembers = gameState.value?.config.maxPlayers ?? 0;
  
  const passedTime = useReadableTimeInterval(createdAt);

  return (
    <div className={styles.dashboard_container}>
      <span>The game was created { passedTime } ago.</span>
      <span>Waiting for others players... ({memberCount} / {totalMembers})</span>
    </div>
  );
}

export default WaitingScreen;
