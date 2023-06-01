import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { BrowserModule } from '../browser/browser.module';
import { MazeGenerator } from './services/maze.generator';
import { MazeSolver } from './services/maze.solver';
import { PlayerGenerator } from './services/player.generator';
import { ColorGenerator } from './services/color.generator';

@Module({
  imports: [RedisModule, UserModule, BrowserModule],
  providers: [
    GameGateway,
    GameService,
    MazeGenerator,
    MazeSolver,
    PlayerGenerator,
    ColorGenerator,
  ],
  exports: [GameService],
})
export class GameModule {}
