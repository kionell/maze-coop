import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { BrowserModule } from '../browser/browser.module';

@Module({
  imports: [RedisModule, UserModule, BrowserModule],
  exports: [GameService],
})
export class GameModule {}
