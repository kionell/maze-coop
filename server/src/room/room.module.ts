import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RedisModule, UserModule],
  providers: [RoomGateway, RoomService],
})
export class RoomModule {}
