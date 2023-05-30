import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RedisModule, UserModule],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}
