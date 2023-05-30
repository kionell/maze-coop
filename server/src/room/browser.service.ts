import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { IGame } from '@common/interfaces/game.interface';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { GameService } from '../game/game.service';

@Injectable()
export class BrowserService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  async getAvailableGames(socket: Socket): Promise<IGame[]> {
    const user = await this.userService.findUser(socket);
    const games = await this.redisService.scan<IGame>();

    return games.filter(({ hostId, members }) => {
      // Skip games made by the same user and full games.
      return user.id !== hostId && members.length < this.gameService.MAX_USERS_PER_ROOM;
    });
  }
}
