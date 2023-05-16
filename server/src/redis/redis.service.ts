import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService implements CacheStore {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.cache.reset();
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return await this.cache.set(key, value);
  }

  async delete(key: string): Promise<void> {
    return await this.cache.del(key);
  }
}
