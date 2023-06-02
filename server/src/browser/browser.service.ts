import { Injectable } from '@nestjs/common';
import { GameStatus } from '@common/enums/GameStatus';
import { CachedGame } from '@common/interfaces/CachedGame';
import { GameInfo } from '@common/interfaces/GameInfo';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BrowserService {
  constructor(private readonly redisService: RedisService) {}

  async getAvailableGames(): Promise<GameInfo[]> {
    const games = await this.redisService.scan<CachedGame>();

    return games
      .filter(({ info, status }) => {
        const { config, members } = info;

        const tooManyPlayers = members.count >= config.maxPlayers;
        const isStarted = status === GameStatus.Started;

        return !tooManyPlayers && !isStarted;
      })
      .map((game) => game.info);
  }
}
