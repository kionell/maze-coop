import { GameCompact } from '@common/interfaces/GameCompact';
import styles from '@styles/Room.module.css';
import JoinGameButton from './JoinGameButton';

const WaitingListEntry: React.FC<GameCompact> = ({ id, metadata }) => {
  return (
    <div className={styles.entry_container}>
      <span>{metadata.hostname} {new Date(metadata.createdAt).toString()}</span>
      <JoinGameButton id={id} />
    </div>
  );
}

export default WaitingListEntry;
