import { useGameBrowser } from '@hooks/useGameBrowser';
import styles from '@styles/Dashboard.module.css';
import WaitingListEntry from './WaitingListEntry';

const WaitingList: React.FC = () => {
  const games = useGameBrowser();

  return (
    <div className={styles.dashboard_container}>
      {
        games.map((game) => {
          return <WaitingListEntry {...game} key={game.metadata.hostId} />;
        })
      }
    </div>
  );
}

export default WaitingList;
