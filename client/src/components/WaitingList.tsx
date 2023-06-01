import { useGameBrowser } from '@hooks/useGameBrowser';
import styles from '@styles/Dashboard.module.css';
import WaitingListEntry from './WaitingListEntry';

const WaitingList: React.FC = () => {
  const games = useGameBrowser();

  return (
    <div className={styles.dashboard_container}>
      {
        games.map((game) => <WaitingListEntry {...game} key={game.id} />)
      }
    </div>
  );
}

export default WaitingList;
