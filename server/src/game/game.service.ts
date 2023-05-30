import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { IGame } from '@common/interfaces/game.interface';
import { IUser } from '@common/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class GameService {
  readonly MAX_PLAYERS = 2;

  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async saveGame(socket: Socket): Promise<IGame> {
    const user = await this.userService.findUser(socket);

    const host: IUser = {
      id: user.id,
      username: user.username,
      joinedAt: Date.now(),
    };

    const room: IGame = {
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

  async getGameBySocket(socket: Socket): Promise<IGame> {
    const user = await this.userService.findUser(socket);

    return this.getGameById(user.id);
  }

  async getGameById(id: string): Promise<IGame> {
    const room = await this.redisService.get<IGame>(id);

    if (!room) {
      throw new Error('Game was not found!');
    }

    return room;
  }

  async addUserToGame(socket: Socket, room: IGame): Promise<IGame> {
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

    await socket.join(room.hostId);

    return room;
  }

  async removeUserFromGame(socket: Socket, room: IGame): Promise<IGame> {
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

    await socket.leave(room.hostId);

    return room;
  }
}
