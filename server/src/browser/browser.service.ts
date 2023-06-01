import { Injectable } from '@nestjs/common';
import { GameStatus } from '@common/enums/GameStatus';
import { GameCompact } from '@common/interfaces/GameCompact';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BrowserService {
  constructor(private readonly redisService: RedisService) {}

  async getAvailableGames(): Promise<GameCompact[]> {
    const games = await this.redisService.scan<GameCompact>();

    return games.filter(({ config, memberCount, status }) => {
      return memberCount < config.maxPlayers && status !== GameStatus.Started;
    });
  }
}
