import { CreateRoomDto } from '@common/dto/create-room.dto'
import { JoinRoomDto } from '@common/dto/join-room.dto'
import { ErrorMessageDto } from '@common/dto/error-message.dto'
import { IRoom } from '@common/interfaces/room.interface';
import { SocketService } from './SocketService';

type ErrorEventListener = (message: ErrorMessageDto) => void;
type RoomEventListener = (room: IRoom) => void;
type RoomsUpdateEventListener = (rooms: IRoom[]) => void;

export class RoomService extends SocketService {
  constructor() {
    super('/dashboard');

    this.socket.once('connect', () => this.browse());

    this.socket.on('room_created', (room: IRoom) => {
      console.log(`${room.hostname} created a new room: ${room.id}`);
      
      this.browse();
    });

    this.socket.on('room_joined', (room: IRoom) => {
      console.log(`${room.username} (${room.userId}) joined to ${room.hostname}'s (${room.id}) room`);
      
      this.browse();
    });

    this.socket.on('room_disbanded', (room: IRoom) => {    
      console.log(`${room.hostname}'s (${room.id}) room was disbanded!`);

      this.browse();
    });

    this.socket.on('multiple_rooms_error', (message: ErrorMessageDto) => {
      console.log(message.error);
    });
  }

  async create(dto: CreateRoomDto): Promise<void> {
    this.socket.emit('create_room', dto);
  }

  async join(dto: JoinRoomDto): Promise<void> {
    this.socket.emit('join_room', dto);
  }

  async leave(): Promise<void> {
    this.socket.emit('leave_room');
  }

  async browse(): Promise<void> {
    this.socket.emit('browse_rooms');
  }

  onRoomCreated(listener: RoomEventListener): void {
    this.socket.on('room_created', listener);
  }

  onRoomJoined(listener: RoomEventListener): void {
    this.socket.on('room_joined', listener);
  }

  onRoomDisbanded(listener: RoomEventListener): void {
    this.socket.on('room_disbanded', listener);
  }

  onRoomsUpdated(listener: RoomsUpdateEventListener): void {
    this.socket.on('rooms_updated', listener);
  }

  onMultipleRoomsJoined(listener: ErrorEventListener): void {
    this.socket.on('multiple_rooms_error', listener);
  }

  offRoomCreated(listener?: RoomEventListener): void {
    this.socket.off('room_created', listener);
  }

  offRoomJoined(listener?: RoomEventListener): void {
    this.socket.off('room_joined', listener);
  }

  offRoomDisbanded(listener?: RoomEventListener): void {
    this.socket.off('room_disbanded', listener);
  }

  offRoomsUpdated(listener?: RoomsUpdateEventListener): void {
    this.socket.off('rooms_updated', listener);
  }

  offMultipleRoomsJoined(listener?: ErrorEventListener): void {
    this.socket.off('multiple_rooms_error', listener);
  }

  removeAllListeners(): void {
    this.offRoomCreated();
    this.offRoomJoined();
    this.offRoomDisbanded();
    this.offRoomsUpdated();
    this.offMultipleRoomsJoined();
  }
}

export const roomService = new RoomService();
