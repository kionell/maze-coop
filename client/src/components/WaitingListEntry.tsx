import { GameMetadata } from '@common/interfaces/GameMetadata';
import styles from '@styles/Room.module.css';
import JoinGameButton from "./JoinGameButton";

const WaitingListEntry: React.FC<GameMetadata> = (props) => {
  return (
    <div className={styles.entry_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <JoinGameButton hostId={props.hostId} />
    </div>
  );
}

export default WaitingListEntry;
