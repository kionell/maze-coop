// import { CreateRoomDto } from '@common/dto/create-room.dto'
// import { JoinRoomDto } from '@common/dto/join-room.dto'
// import { ErrorMessageDto } from '@common/dto/error-message.dto'
// import { IRoom } from '@common/interfaces/room.interface';
// import { SocketService } from './SocketService';

// type ErrorEventListener = (message: ErrorMessageDto) => void;
// type RoomEventListener = (room: IRoom) => void;
// type RoomsUpdateEventListener = (rooms: IRoom[]) => void;

// export class GameService extends SocketService {
//   namespace = '/dashboard';
  
//   constructor() {
//     super();

//     this.socket.on('room_created', (room: IRoom) => {
//       console.log(`${room.hostname} created a new room: ${room.id}`);
      
//       this.browse();
//     });

//     this.socket.on('room_joined', (room: IRoom) => {
//       console.log(`${room.username} (${room.userId}) joined to ${room.hostname}'s (${room.id}) room`);
      
//       this.browse();
//     });

//     this.socket.on('room_disbanded', (room: IRoom) => {    
//       console.log(`${room.hostname}'s (${room.id}) room was disbanded!`);

//       this.browse();
//     });

//     this.socket.on('connect', () => {
//       console.log('Connected to the dashboard!');

//       this.browse();
//     });

//     this.socket.on('multiple_rooms_error', (message: ErrorMessageDto) => {
//       console.log(message.error);
//     });
//   }

//   async create(dto: CreateRoomDto): Promise<void> {
//     this.socket.emit('create_room', dto);
//   }

//   async join(dto: JoinRoomDto): Promise<void> {
//     this.socket.emit('join_room', dto);
//   }

//   async leave(): Promise<void> {
//     this.socket.emit('leave_room');
//   }

//   async browse(): Promise<void> {
//     this.socket.emit('browse_rooms');
//   }

//   onRoomCreate(listener: RoomEventListener): void {
//     this.socket.on('room_created', listener);
//   }

//   onRoomJoin(listener: RoomEventListener): void {
//     this.socket.on('room_joined', listener);
//   }

//   onRoomDisband(listener: RoomEventListener): void {
//     this.socket.on('room_disbanded', listener);
//   }

//   onRoomsUpdate(listener: RoomsUpdateEventListener): void {
//     this.socket.on('rooms_updated', listener);
//   }

//   onMultipleRoomJoin(listener: ErrorEventListener): void {
//     this.socket.on('multiple_rooms_error', listener);
//   }

//   offRoomCreate(listener?: RoomEventListener): void {
//     this.socket.off('room_created', listener);
//   }

//   offRoomJoin(listener?: RoomEventListener): void {
//     this.socket.off('room_joined', listener);
//   }

//   offRoomDisband(listener?: RoomEventListener): void {
//     this.socket.off('room_disbanded', listener);
//   }

//   offRoomsUpdate(listener?: RoomsUpdateEventListener): void {
//     this.socket.off('rooms_updated', listener);
//   }

//   offMultipleRoomJoin(listener?: ErrorEventListener): void {
//     this.socket.off('multiple_rooms_error', listener);
//   }

//   removeAllListeners(): void {
//     this.offRoomCreate();
//     this.offRoomJoin();
//     this.offRoomDisband();
//     this.offRoomsUpdate();
//     this.offMultipleRoomJoin();
//   }
// }

// export const gameService = new GameService();
