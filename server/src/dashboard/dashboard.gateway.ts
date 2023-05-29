import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import type { CreateRoomDto } from '@common/dto/create-room.dto';
import type { JoinRoomDto } from '@common/dto/join-room.dto';
import { DashboardService } from './dashboard.service';

@WebSocketGateway({ path: '/dashboard' })
class DashboardGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(private readonly dashboardService: DashboardService) {}

  @SubscribeMessage('create_room')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: CreateRoomDto,
  ) {
    if (socket.rooms.size > 1) {
      return socket.emit('multiple_rooms_error', {
        error: 'You are already in a different room!',
      });
    }

    const room = await this.dashboardService.saveRoom(message);

    // await socket.join(room.id);

    this.io.emit('room_created', room);

    console.log(`${room.hostname} created a new room: ${room.id}`);
  }

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() message: JoinRoomDto) {
    if (socket.rooms.size > 1) {
      return socket.emit('multiple_rooms_error', {
        error: 'You are already in a different room!',
      });
    }

    const room = await this.dashboardService.addUserToRoom(message);

    if (!room) return;

    // await socket.join(room.id);

    this.io.emit('room_joined', room);

    const userTag = `${room.username} (${room.userId})`;
    const hostTag = `${room.hostname} (${room.hostId})`;

    console.log(`${userTag} joined to ${hostTag} room`);
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(@ConnectedSocket() socket: Socket) {
    const room = await this.dashboardService.removeUserFromRoom(socket.id);

    if (!room) return;

    // await socket.leave(room.hostId);

    // This means user was on waiting screen and decided to quit.
    // Notify all users who are on the dashboard screen that room isn't available anymore.
    if (room.members.length === 0) {
      this.io.emit('room_disbanded', room);
    }

    // One or more users left when the game has already started.
    // Notify all users in the game that the game was cancelled.
    if (room.members.length === 1) {
      // this.io.to(room.id).emit('room_disbanded', room);
    }

    if (room.members.length <= 1) {
      console.log(`${room.hostname}'s (${room.id}) room was disbanded!`);
    }
  }

  @SubscribeMessage('browse_rooms')
  async browseRooms(@ConnectedSocket() socket: Socket) {
    const availableRooms = await this.dashboardService.getAvailableRooms(
      this.io,
      socket.id,
    );

    socket.emit('rooms_updated', availableRooms);
  }

  async handleDisconnect(socket: Socket) {
    return this.leaveRoom(socket);
  }
}

export { DashboardGateway };
