import { Module } from '@nestjs/common';
import { BrowserGateway } from './browser.gateway';
import { BrowserService } from './browser.service';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [RedisModule, UserModule, GameModule],
  providers: [BrowserGateway, BrowserService],
})
export class BrowserModule {}
