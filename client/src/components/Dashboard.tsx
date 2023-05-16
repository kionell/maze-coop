'use client';

import { useEffect, useState } from 'react';
import { roomService } from '@services/RoomService';
import styles from '@styles/Dashboard.module.css';
import Greeting from './Greeting';
import Room from './Room';
import { IRoom } from '@common/interfaces/room.interface';

interface IDashboardProps {}

const Dashboard: React.FC<IDashboardProps> = ({}: IDashboardProps) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    const onRoomUpdate = (availableRooms: IRoom[]) => {
      console.log('Browsed rooms:');
      console.log(availableRooms);
      setRooms(availableRooms);
    };

    async function connect() {
      await roomService.connect('ws://127.0.0.1:3000');
      await roomService.browse();

      roomService.socket?.on('rooms-updated', onRoomUpdate);
    }

    connect();

    return () => {
      roomService.socket?.off('rooms-updated', onRoomUpdate);
      roomService.disconnect();
    };
  }, []);
  
  return (
    <div className={styles.dashboard_container}>
      <Greeting />
      {
        rooms.map((room) => {
          return <Room {...room} key={room.id} />;
        })
      }
    </div>
  );
}

export default Dashboard;
