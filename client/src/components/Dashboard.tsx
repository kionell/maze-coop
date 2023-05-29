import { useContext, useEffect, useState } from 'react';
import { roomService } from '@services/RoomService';
import { IRoom } from '@common/interfaces/room.interface';
import { UserContext } from '@context/UserContext';
import { GameContext } from '@context/GameContext';
import styles from '@styles/Dashboard.module.css';
import Greeting from './Greeting';
import DashboardRoom from './DashboardRoom';

const Dashboard: React.FC = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const userState = useContext(UserContext);
  const playingState = useContext(GameContext);

  const onRoomCreateClick = () => {
    roomService.create({
      roomId: userState.value?.id as string,
      hostId: userState.value?.id as string,
      hostname: userState.value?.username as string,
      createdAt: Date.now(),
    });

    playingState.update(true);
  };

  useEffect(() => {
    roomService.onRoomsUpdated((rooms: IRoom[]) => {
      console.log(rooms);
      setRooms(rooms);
    });

    roomService.connect();

    return () => {
      roomService.removeAllListeners();
    };
  }, []);
  
  return (
    <div className={styles.dashboard_container}>
      <Greeting />
      {
        rooms.map((room) => {
          return <DashboardRoom {...room} key={room.id} />;
        })
      }
      <button onClick={onRoomCreateClick}>Create Room</button>
    </div>
  );
}

export default Dashboard;
