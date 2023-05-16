import { useContext } from "react";
import { IRoom } from '@common/interfaces/room.interface';
import { roomService } from "@services/RoomService";
import { UsernameContext } from "@context/UsernameContext";
import styles from '@styles/Room.module.css';

interface IRoomProps extends IRoom {}

const Room: React.FC<IRoomProps> = (props) => {
  const [username] = useContext(UsernameContext);
  
  const onJoinClick = () => {
    if (!roomService.isConnected || !roomService.socket) return;

    roomService.join({
      joinedAt: Date.now(),
      roomId: props.id,
      userId: roomService.socket.id,
      username,
    });
  };
  
  return (
    <div className={styles.room_container}>
      <span>{props.hostname} {new Date(props.createdAt).toString()}</span>
      <button onClick={onJoinClick}>Join Room</button>
    </div>
  );
}

export default Room;
