import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { IRoom } from '@common/interfaces/room.interface';
import { IUser } from '@common/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomService {
  readonly MAX_USERS_PER_ROOM = 2;

  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async saveRoom(socket: Socket): Promise<IRoom> {
    const user = await this.userService.findUser(socket);

    const host: IUser = {
      id: user.id,
      username: user.username,
      joinedAt: Date.now(),
    };

    const room: IRoom = {
      hostId: host.id,
      hostname: host.username,
      userId: host.id,
      username: host.username,
      createdAt: host.joinedAt,
      members: [host],
    };

    await this.redisService.set(room.hostId, room);

    return room;
  }

  async getRoomBySocket(socket: Socket): Promise<IRoom | null> {
    const user = await this.userService.findUser(socket);

    return await this.getRoomById(user.id);
  }

  async getRoomById(id: string): Promise<IRoom | null> {
    return await this.redisService.get<IRoom>(id);
  }

  async addUserToRoom(socket: Socket, room: IRoom): Promise<IRoom> {
    const user = await this.userService.findUser(socket);

    room.members.push({
      id: user.id,
      username: user.username,
      joinedAt: Date.now(),
    });

    // Each entry in the cache is a relationship between a user and a room they are currently in.
    // To make it easier to index rooms in the cache we will attach the same room to the all room members.
    // We can interchange room and user ID because they are taken from the socket ID and always match.
    this.redisService.set(room.hostId, room);

    room.userId = user.id;
    room.username = user.username;

    this.redisService.set(room.userId, room);

    return room;
  }

  async removeUserFromRoom(socket: Socket, room: IRoom): Promise<IRoom> {
    const user = await this.userService.findUser(socket);

    room.members = room.members.filter((member) => {
      return member.id !== user.id;
    });

    this.redisService.delete(room.userId);

    if (room.members.length <= 1) {
      this.redisService.delete(room.hostId);
    } else {
      this.redisService.set(room.hostId, room);
    }

    return room;
  }

  async getAvailableRooms(socket: Socket): Promise<IRoom[]> {
    const user = await this.userService.findUser(socket);
    const rooms = await this.redisService.scan<IRoom>();

    return rooms.filter(({ hostId, members }) => {
      // Skip rooms made by the same user and full rooms.
      return user.id !== hostId && members.length < this.MAX_USERS_PER_ROOM;
    });
  }
}
