import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import type { IRoom } from '@common/interfaces/room.interface';
import type { CreateRoomDto } from '@common/dto/create-room.dto';
import type { JoinRoomDto } from '@common/dto/join-room.dto';

@Injectable()
export class DashboardService {
  readonly MAX_USERS_PER_ROOM = 2;

  constructor(private readonly redisService: RedisService) {}

  async saveRoom(message: CreateRoomDto): Promise<IRoom> {
    const room: IRoom = {
      id: message.roomId,
      hostId: message.hostId,
      hostname: message.hostname,
      userId: message.hostId,
      username: message.hostname,
      createdAt: message.createdAt,
      members: [
        {
          id: message.hostId,
          username: message.hostname,
          joinedAt: message.createdAt,
        },
      ],
    };

    // await this.redisService.set<IRoom>(room.hostId, room);

    return room;
  }

  async getRoom(roomId: string): Promise<IRoom | null> {
    return await this.redisService.get<IRoom>(roomId);
  }

  async addUserToRoom(message: JoinRoomDto): Promise<IRoom | null> {
    const room = await this.redisService.get<IRoom>('a'); // message.roomId);

    if (!room) return;

    room.members.push({
      id: message.userId,
      username: message.username,
      joinedAt: message.joinedAt,
    });

    // Each entry in the cache is a relationship between a user and a room they are currently in.
    // To make it easier to index rooms in the cache we will attach the same room to the all room members.
    // We can interchange room and user ID because they are taken from the socket ID and always match.
    // this.redisService.set<IRoom>(message.roomId, room);

    room.userId = message.userId;
    room.username = message.username;

    // this.redisService.set<IRoom>(message.userId, room);

    return room;
  }

  async removeUserFromRoom(userId: string): Promise<IRoom | null> {
    const room = await this.redisService.get<IRoom>(userId);

    if (!room) return null;

    room.members = room.members.filter((member) => {
      return true;
      // return member.id !== userId;
    });

    // this.redisService.delete(room.userId);

    if (room.members.length <= 1) {
      // this.redisService.delete(room.hostId);

      return room;
    }

    // this.redisService.set(room.hostId, {
    //   ...room,
    //   userId: room.hostId,
    //   username: room.hostname,
    // });

    return room;
  }

  async getAvailableRooms(io: Server, userId: string): Promise<IRoom[]> {
    const promises = [...io.sockets.adapter.rooms]
      .filter(([id, members]) => {
        // Skip rooms made by the same user and full rooms.
        return userId !== id && members.size < this.MAX_USERS_PER_ROOM;
      })
      .map(([id]) => this.redisService.get<IRoom>(id));

    const result = await Promise.all(promises);

    return result.filter((x) => x);
  }
}
