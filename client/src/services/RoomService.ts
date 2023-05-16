import { io, Socket } from 'socket.io-client';
import { JoinRoomDto } from '@common/dto/join-room.dto'
import { CreateRoomDto } from '@common/dto/create-room.dto'

class RoomService {
  socket: Socket | null = null;

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  connect(uri: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(uri);

      if (!this.socket) return reject();

      this.socket.on('room-created', () => this.onRoomCreate());
      this.socket.on('room-joined', () => this.onRoomJoin());
      this.socket.on('room-disbanded', () => this.onRoomDisband());
      this.socket.on('connect-error', this.onConnectError);
      this.socket.on('multiple-rooms-error', this.onMultipleRoomJoin);

      this.socket.once('connect', () => {
        resolve();
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket || this.socket.disconnected) return;
    
      this.socket.removeAllListeners('room-created');
      this.socket.removeAllListeners('room-joined');
      this.socket.removeAllListeners('room-disbanded');
      this.socket.removeAllListeners('connect-error');

      this.socket.once('disconnect', () => {
        this.onDisconnect();
        resolve();
      });
      
      this.socket.disconnect();
    });
  }

  async create(dto: CreateRoomDto): Promise<void> {
    if (!this.socket) return;

    this.socket.emit('create-room', dto);
  }

  async join(dto: JoinRoomDto): Promise<void> {
    if (!this.socket) return;

    this.socket.emit('join-room', dto);
  }

  async disband(): Promise<void> {
    if (!this.socket) return;

    this.socket.emit('disband-room', this.socket.id);
  }

  async browse(): Promise<void> {
    if (!this.socket) return;

    this.socket.emit('browse-rooms');
  }

  onRoomCreate(): void {
    console.log('A new room was created');

    this.browse();
  }

  onRoomJoin(): void {
    console.log('One of the users joined a room');

    this.browse();
  }

  onRoomDisband(): void {
    console.log('A room was disbanded');

    this.browse();
  }

  onMultipleRoomJoin(message: { error: string }): void {
    console.warn(message.error);
  }

  onConnectError(err: unknown): void {
    console.log('Connection error: ', err);
  }

  onDisconnect(): void {
    console.log('Disconnected!');

    this.disband();
    this.browse();
  }
}

export const roomService = new RoomService();