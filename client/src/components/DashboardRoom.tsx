import { useContext } from "react";
import { IRoom } from '@common/interfaces/room.interface';
import { roomService } from "@services/RoomService";
import { UserContext } from "@context/UserContext";
import { GameContext } from "@context/GameContext";
import styles from '@styles/Room.module.css';

type IDashboardRoomProps = IRoom

const DashboardRoom: React.FC<IDashboardRoomProps> = (props) => {
  const userState = useContext(UserContext);
  const playingState = useContext(GameContext);

  const onJoinClick = () => {
    if (!userState.value) return;

    roomService.join({
      joinedAt: Date.now(),
      roomId: props.id,
      userId: userState.value.id,
      username: userState.value.username,
    });

    playingState.set(true);
  };
  
  return (
    <div className={styles.room_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <button onClick={onJoinClick}>Join Room</button>
    </div>
  );
}

export default DashboardRoom;
