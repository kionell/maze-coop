import { Injectable } from '@nestjs/common';
import { GameCompact } from '@common/interfaces/GameCompact';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BrowserService {
  constructor(private readonly redisService: RedisService) {}

  async getAvailableGames(): Promise<GameCompact[]> {
    const games = await this.redisService.scan<GameCompact>();

    return games.filter(({ config, members }) => {
      return members.length < config.maxPlayers;
    });
  }
}
