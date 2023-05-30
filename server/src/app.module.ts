import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { BrowserModule } from './room/browser.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_DB_PORT) || 5432,
      username: process.env.POSTGRES_DB_USERNAME || 'postgres',
      password: process.env.POSTGRES_DB_PASSWORD || '123',
      database: process.env.POSTGRES_DB_DATABASE || 'maze',
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      synchronize: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    GameModule,
    BrowserModule,
    UserModule,
    ChatModule,
    RedisModule,
  ],
})
export class AppModule {}
