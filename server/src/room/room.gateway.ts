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
    let data = null;
    let error = null;

    try {
      data = await this.roomService.saveRoom(socket);
    } catch (err: any) {
      error = 'Failed to create a room';
    } finally {
      socket.broadcast.emit('room_create', { data, error });
    }
  }

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() hostId: string) {
    let data = null;
    let error = null;

    try {
      const room = await this.roomService.getRoomById(hostId);

      data = await this.roomService.addUserToRoom(socket, room);
    } catch (err: any) {
      error = 'Failed to join a room';
    } finally {
      this.io.emit('room_join', { data, error });
    }
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      const room = await this.roomService.getRoomBySocket(socket);

      data = await this.roomService.removeUserFromRoom(socket, room);
    } catch (err: any) {
      error = 'Failed to leave a room';
    } finally {
      this.io.emit('room_disband', { data, error });
    }
  }

  @SubscribeMessage('browse_rooms')
  async browseRooms(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      data = await this.roomService.getAvailableRooms(socket);
    } catch (err: any) {
      error = 'Failed to get available rooms';
    } finally {
      socket.emit('rooms_update', { data, error });
    }
  }

  async handleDisconnect(socket: Socket) {
    return this.leaveRoom(socket);
  }
}

export { RoomGateway };
