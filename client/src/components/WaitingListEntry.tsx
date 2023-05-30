import { IGame } from '@common/interfaces/game.interface';
import styles from '@styles/Room.module.css';
import JoinGameButton from "./JoinGameButton";

const WaitingListEntry: React.FC<IGame> = (props) => {
  return (
    <div className={styles.entry_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <JoinGameButton hostId={props.hostId} />
    </div>
  );
}

export default WaitingListEntry;
