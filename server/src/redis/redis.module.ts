import { Module } from '@nestjs/common';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        console.log(process.env.REDIS_URI);

        return {
          store: await redisStore({
            url: process.env.REDIS_URI,
          }),
        } as CacheModuleAsyncOptions;
      },
      isGlobal: true,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
