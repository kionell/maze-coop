import { useEffect, useState } from 'react';
import { browserService } from '@services/BrowserService';
import { IGame } from '@common/interfaces/game.interface';
import styles from '@styles/Dashboard.module.css';
import WaitingListEntry from './WaitingListEntry';

const WaitingList: React.FC = () => {
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    browserService.onUpdate(({ error, data }) => {
      if (!error) setGames(data);
    });

    browserService.connect();

    return () => {
      browserService.offUpdate();
    };
  }, []);
  
  return (
    <div className={styles.dashboard_container}>
      {
        games.map((game) => {
          return <WaitingListEntry {...game} key={game.hostId} />;
        })
      }
    </div>
  );
}

export default WaitingList;
