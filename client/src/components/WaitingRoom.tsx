import { IRoom } from '@common/interfaces/room.interface';
import styles from '@styles/Room.module.css';
import JoinGameButton from "./JoinGameButton";

type IDashboardRoomProps = IRoom

const DashboardRoom: React.FC<IDashboardRoomProps> = (props) => {
  return (
    <div className={styles.room_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <JoinGameButton hostId={props.hostId} />
    </div>
  );
}

export default DashboardRoom;
