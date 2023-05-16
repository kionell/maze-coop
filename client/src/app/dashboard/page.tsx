'use client';

import { useContext } from 'react';
import { roomService } from '@services/RoomService';
import { UsernameContext } from '@context/UsernameContext';
import Dashboard from '@components/Dashboard';

export default function Home() {
  const [username] = useContext(UsernameContext);

  const onRoomCreateClick = () => {
    if (!roomService.isConnected || !roomService.socket) return;

    // To simplify things, use socket ID as room and user ID.
    roomService.create({
      roomId: roomService.socket.id,
      hostId: roomService.socket.id,
      hostname: username,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="page-div">
      <Dashboard />
      <button onClick={onRoomCreateClick}>Create Room</button>
    </div>
  );
}
