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
    roomService.join({
      joinedAt: Date.now(),
      roomId: props.id,
      userId: userState.value?.id as string,
      username: userState.value?.username as string,
    });

    playingState.update(true);
  };
  
  return (
    <div className={styles.room_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <button onClick={onJoinClick}>Join Room</button>
    </div>
  );
}

export default DashboardRoom;
