import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Game } from '@common/interfaces/Game';
import { GameCompact } from '@common/interfaces/GameCompact';
import { GameMember } from '@common/interfaces/GameMember';
import { GameConfig } from '@common/interfaces/GameConfig';
import { GameStatus } from '@common/enums/GameStatus';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { MazeGenerator } from './services/maze.generator';
import { PlayerGenerator } from './services/player.generator';
import { ColorGenerator } from './services/color.generator';

@Injectable()
export class GameService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly mazeGenerator: MazeGenerator,
    private readonly playerGenerator: PlayerGenerator,
    private readonly colorGenerator: ColorGenerator,
  ) {}

  async createGame(socket: Socket, config: GameConfig): Promise<GameCompact> {
    const user = await this.userService.findUser(socket);

    const host: GameMember = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.getTime(),
      joinedAt: Date.now(),
    };

    const compact: GameCompact = {
      id: randomUUID(),
      status: GameStatus.Created,
      metadata: {
        hostId: host.id,
        hostname: host.username,
        createdAt: host.joinedAt,
      },
      memberCount: 1,
      members: new Array(config.maxPlayers)
        .fill(null)
        .map((_, i) => (i === 0 ? host : null)),

      config,
    };

    const game: Game = {
      ...compact,
      state: {
        turnIndex: 0,
        positions: [],
      },
      layout: {
        maze: [],
        spawnPoints: [],
        colors: [],
      },
      chat: [],
    };

    await this.redisService.set(game.id, game);
    await socket.join(game.id);

    return compact;
  }

  async startGame(game: Game): Promise<GameCompact> {
    const maze = this.mazeGenerator.generate(game.config);
    const spawnPoints = this.playerGenerator.generate(maze, game.config);

    game.layout = {
      colors: this.colorGenerator.generate(game.config),
      spawnPoints,
      maze,
    };

    game.state.positions = spawnPoints;
    game.status = GameStatus.Started;

    this.redisService.set(game.id, game);

    return this.makeCompactGame(game);
  }

  async addUserToGame(socket: Socket, game: Game): Promise<GameCompact> {
    const user = await this.userService.findUser(socket);

    // We want to preserve original player position in the list.
    // That's the reason why we can't use default push() here.
    //
    // Example: [P1, null, null, P2] -> [P1, P3, null, P2]
    for (let i = 0; i < game.members.length; i++) {
      if (game.members[i]) continue;

      game.members[i] = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.getTime(),
        joinedAt: Date.now(),
      };

      game.memberCount++;

      break;
    }

    this.redisService.set(game.id, game);

    await socket.join(game.id);

    return this.makeCompactGame(game);
  }

  async removeUserFromGame(socket: Socket, game: Game): Promise<GameCompact> {
    const user = await this.userService.findUser(socket);

    // We want to preserve original player position in the list.
    //
    // Example: [P1, P3, null, P2] -> [null, P3, null, P2]
    for (let i = game.members.length - 1; i >= 0; i--) {
      if (game.members[i]?.id !== user.id) continue;

      game.members[i] = null;
      game.memberCount--;
    }

    // Handle the case when all members left the game.
    if (game.memberCount === 0) {
      game.status = GameStatus.Cancelled;

      this.redisService.delete(game.id);
    } else {
      this.redisService.set(game.id, game);
    }

    await socket.leave(game.id);

    return this.makeCompactGame(game);
  }

  async getGameById(id: string): Promise<Game> {
    const game = await this.redisService.get<Game>(id);

    if (!game) {
      throw new Error('Game was not found!');
    }

    return game;
  }

  async getCompactGameById(id: string): Promise<GameCompact> {
    return this.makeCompactGame(await this.getGameById(id));
  }

  private makeCompactGame(game: Game): GameCompact {
    return {
      id: game.id,
      config: game.config,
      members: game.members,
      memberCount: game.memberCount,
      metadata: game.metadata,
      status: game.status,
    };
  }
}
