import { useReadableTimeInterval } from '@hooks/useReadableTimeInterval';
import { useGameStartListener } from '@hooks/useGameStartListener';
import { useGameContext } from '@hooks/useGameContext';
import styles from '@styles/Dashboard.module.css';

const WaitingScreen: React.FC = () => {
  const gameState = useGameContext();
  const passedTime = useReadableTimeInterval(gameState.value?.metadata.createdAt);

  useGameStartListener();

  return (
    <div className={styles.dashboard_container}>
      <span>You started a new game { passedTime } ago.</span>
      <span>Waiting for a second player...</span>
    </div>
  );
}

export default WaitingScreen;
