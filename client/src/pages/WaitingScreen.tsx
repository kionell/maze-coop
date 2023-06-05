import { useReadableTimeInterval } from '@hooks/useReadableTimeInterval';
import { useMemberCount } from '@hooks/useMemberCount';
import styles from '@styles/Dashboard.module.css';

const WaitingScreen: React.FC = () => {
  const passedTime = useReadableTimeInterval();
  const [current, total] = useMemberCount();

  return (
    <div className={styles.dashboard_container}>
      <span>The game was created { passedTime } ago.</span>
      <span>Waiting for others players... ({ current } / { total })</span>
    </div>
  );
}

export default WaitingScreen;
