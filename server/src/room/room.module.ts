import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RoomGateway],
})
export class RoomModule {}
