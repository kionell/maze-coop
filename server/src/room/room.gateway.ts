import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { RoomService } from './room.service';

@WebSocketGateway({ path: '/rooms' })
class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('create_room')
  async createRoom(@ConnectedSocket() socket: Socket) {
    const room = await this.roomService.saveRoom(socket);

    socket.broadcast.emit('room_created', room);

    console.log(`${room.hostname} created a new room: ${room.hostId}`);
  }

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() hostId: string) {
    const room = await this.roomService.getRoomById(hostId);

    if (!room) return;

    await this.roomService.addUserToRoom(socket, room);
    await socket.join(room.hostId);

    this.io.emit('room_joined', room);

    const userTag = `${room.username} (${room.userId})`;
    const hostTag = `${room.hostname} (${room.hostId})`;

    console.log(`${userTag} joined to ${hostTag} room`);
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(@ConnectedSocket() socket: Socket) {
    const room = await this.roomService.getRoomBySocket(socket);

    if (!room) return;

    await this.roomService.removeUserFromRoom(socket, room);
    await socket.leave(room.hostId);

    this.io.emit('room_disbanded', room);
    console.log(`${room.hostname}'s (${room.hostId}) room was disbanded!`);
  }

  @SubscribeMessage('browse_rooms')
  async browseRooms(@ConnectedSocket() socket: Socket) {
    const availableRooms = await this.roomService.getAvailableRooms(socket);

    socket.emit('rooms_updated', availableRooms);
  }

  async handleDisconnect(socket: Socket) {
    return this.leaveRoom(socket);
  }
}

export { RoomGateway };
