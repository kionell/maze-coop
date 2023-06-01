import { Module } from '@nestjs/common';
import { BrowserGateway } from './browser.gateway';
import { BrowserService } from './browser.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [BrowserGateway, BrowserService],
  exports: [BrowserGateway],
})
export class BrowserModule {}
