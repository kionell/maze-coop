import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { CreateRoomDto } from '@common/dto/create-room.dto';
import { JoinRoomDto } from '@common/dto/join-room.dto';
import { IRoom } from '@common/interfaces/room.interface';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('create-room')
  async create(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: CreateRoomDto,
  ) {
    const hasOwnRoom = await this.redisService.has(message.hostId);

    if (hasOwnRoom) {
      return socket.emit('multiple-rooms-error', {
        error: 'You are already in a different room!',
      });
    }

    const room: IRoom = {
      id: message.roomId,
      hostId: message.hostId,
      hostname: message.hostname,
      createdAt: message.createdAt,
      members: [
        {
          id: message.hostId,
          username: message.hostname,
          joinedAt: message.createdAt,
        },
      ],
    };

    await this.redisService.set<IRoom>(room.hostId, room);

    socket.broadcast.emit('room-created', room);

    console.log(`${room.hostname} created a new room: ${room.id}`);
  }

  @SubscribeMessage('join-room')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: JoinRoomDto,
  ) {
    const room = await this.redisService.get<IRoom>(message.roomId);

    if (!room) {
      return socket.emit('room-not-found-error', {
        error: 'This room does not exist!',
      });
    }

    // To simplify things the user and room ID will be taken from the socket ID.
    const hasOwnRoom = await this.redisService.has(message.userId);

    if (hasOwnRoom) {
      return socket.emit('multiple-rooms-error', {
        error: 'You are already in a different room!',
      });
    }

    room.members.push({
      id: message.userId,
      username: message.username,
      joinedAt: message.joinedAt,
    });

    room.members.forEach((member) => {
      this.redisService.set<IRoom>(member.id, room);
    });

    await socket.leave(socket.id);
    await socket.join(room.id);

    this.io.emit('room-joined', room);

    console.log(`${message.username} joined to the ${room.hostname}'s room`);
  }

  @SubscribeMessage('browse-rooms')
  async browse(@ConnectedSocket() socket: Socket) {
    const socketRooms = [...this.io.sockets.adapter.rooms];

    try {
      const promises = socketRooms
        // Skip rooms made by the same user and full rooms.
        .filter(([id, members]) => socket.id !== id && members.size <= 1)
        .map(([id]) => this.redisService.get<IRoom>(id));

      const result = await Promise.all(promises);
      const availableRooms = result.filter((x) => x);

      socket.emit('rooms-updated', availableRooms);
    } catch {
      socket.emit('rooms-update-error', {
        error: 'Failed to update rooms!',
      });
    }
  }

  async handleDisconnect(socket: Socket) {
    this.io.sockets.adapter.rooms.delete(socket.id);

    const room = await this.redisService.get<IRoom>(socket.id);

    if (room) {
      room.members.forEach((member) => {
        this.redisService.delete(member.id);
      });
    }

    this.io.emit('room-disbanded');
  }
}
