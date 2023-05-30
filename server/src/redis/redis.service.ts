import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {
    this.redis.flushall();
  }

  async get<T>(key: string): Promise<T | null> {
    return JSON.parse(await this.redis.get(key)) ?? null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  async has(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) > 0;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async scan<T>(limit = 0): Promise<T[]> {
    const elements: T[] = [];

    let cursor = 0;

    do {
      const scan = await this.redis.scan(cursor);

      cursor = parseInt(scan[0]);

      for (const key of scan[1]) {
        elements.push(await this.get<T>(key));
      }
    } while (cursor !== 0 || (limit && cursor <= limit));

    return elements;
  }
}
