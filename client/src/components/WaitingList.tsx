import { useEffect, useState } from 'react';
import { roomService } from '@services/RoomService';
import { IRoom } from '@common/interfaces/room.interface';
import styles from '@styles/Dashboard.module.css';
import WaitingRoom from './WaitingRoom';

const WaitingList: React.FC = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    roomService.onUpdate(({ error, data }) => {
      if (!error) setRooms(data);
    });

    roomService.connect();

    return () => {
      roomService.offUpdate();
    };
  }, []);
  
  return (
    <div className={styles.dashboard_container}>
      {
        rooms.map((room) => {
          return <WaitingRoom {...room} key={room.hostId} />;
        })
      }
    </div>
  );
}

export default WaitingList;
