import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { CreateRoomDto } from '@common/dto/create-room.dto';
import { JoinRoomDto } from '@common/dto/join-room.dto';
import { IRoomMetadata } from '@common/interfaces/room-metadata.interface';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({ cors: true })
export class RoomGateway {
  @WebSocketServer()
  io: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('create-room')
  async create(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: CreateRoomDto,
  ) {
    this.redisService.set<IRoomMetadata>(socket.id, {
      ...message,
      roomId: socket.id,
    });

    console.log(`Created room: ${message.hostname}`);

    socket.broadcast.emit('room-created');
  }

  @SubscribeMessage('join-room')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: JoinRoomDto,
  ) {
    const targetRoomId = message.roomId.toString();

    if (!this.io.sockets.adapter.rooms.has(targetRoomId)) {
      socket.emit('room-not-found-error', {
        error: 'This room does not exist!',
      });

      return;
    }

    if (socket.rooms.size > 1) {
      socket.emit('multiple-rooms-error', {
        error: 'You are already in a different room!',
      });

      return;
    }

    await socket.join(targetRoomId);

    console.log(`Joined room: ${message.username}`);

    socket.broadcast.emit('room-joined', message);
  }

  @SubscribeMessage('browse-rooms')
  async browse(@ConnectedSocket() socket: Socket) {
    const availableRooms: IRoomMetadata[] = [];

    const addOrIgnoreRoom = async (members: Set<string>, roomId: string) => {
      // Skip rooms made by the same user.
      if (socket.id === roomId) return;

      // Skip rooms the user is already in.
      if (members.has(socket.id)) return;

      // Skip full rooms.
      if (members.size >= 2) return;

      const metadata = await this.redisService.get<IRoomMetadata>(roomId);

      if (metadata) {
        availableRooms.push({
          ...metadata,
          roomId: socket.id,
        });
      }
    };

    const promises = [];

    this.io.sockets.adapter.rooms.forEach((members, roomId) => {
      promises.push(addOrIgnoreRoom(members, roomId));
    });

    Promise.all(promises)
      .then(() => {
        socket.emit('rooms-updated', availableRooms);
      })
      .catch(() => {
        socket.emit('rooms-update-error', {
          error: 'Failed to update rooms!',
        });
      });
  }
}
