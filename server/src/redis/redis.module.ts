import { RedisModule as IORedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    IORedisModule.forRoot({
      config: {
        url: process.env.REDIS_URI,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
