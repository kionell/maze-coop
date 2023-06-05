import { Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { CachedGame } from '@common/interfaces/CachedGame';
import { GameState } from '@common/interfaces/GameState';
import { GameInfo } from '@common/interfaces/GameInfo';
import { GameMember } from '@common/interfaces/GameMember';
import { GameConfig } from '@common/interfaces/GameConfig';
import { ChatMessage } from '@common/interfaces/ChatMessage';
import { NextPosition } from '@common/interfaces/NextPosition';
import { GameStatus } from '@common/enums/GameStatus';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { MazeGenerator } from './services/maze.generator';
import { PlayerGenerator } from './services/player.generator';
import { ColorGenerator } from './services/color.generator';
import { MazeCellType } from '../../../common/enums/MazeCellType';

@Injectable()
export class GameService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly mazeGenerator: MazeGenerator,
    private readonly playerGenerator: PlayerGenerator,
    private readonly colorGenerator: ColorGenerator,
  ) {}

  async createGame(socket: Socket, config: GameConfig): Promise<GameInfo> {
    const user = await this.userService.findUser(socket);
    const colors = this.colorGenerator.generate(config);

    const host: GameMember = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.getTime(),
      color: colors[0],
      joinedAt: Date.now(),
    };

    const game: CachedGame = {
      info: {
        id: randomUUID(),
        config,
        members: {
          count: 1,
          list: new Array(config.maxPlayers)
            .fill(null)
            .map((_, i) => (i === 0 ? host : null)),
        },
        metadata: {
          hostId: host.id,
          hostname: host.username,
          createdAt: host.joinedAt,
        },
      },
      layout: {
        maze: [],
        startPositions: [],
        colors,
      },
      positions: [],
      chat: [],
      status: GameStatus.Created,
      turnIndex: Math.round(Math.random() * config.maxPlayers),
    };

    await this.redisService.set(game.info.id, game);
    await socket.join(game.info.id);

    return game.info;
  }

  async startGame(game: CachedGame): Promise<GameState[]> {
    const { id, config } = game.info;

    const maze = this.mazeGenerator.generate(config);
    const startPositions = this.playerGenerator.generate(maze, config);

    game.layout.maze = maze;
    game.layout.startPositions = startPositions;
    game.positions = startPositions;
    game.status = GameStatus.Started;

    this.redisService.set(id, game);

    return startPositions.map((position, i) => {
      return {
        turnIndex: game.turnIndex,
        status: game.status,
        member: game.info.members.list[i],
        position,
      };
    });
  }

  async addMember(socket: Socket, game: CachedGame): Promise<GameInfo> {
    const { id, members } = game.info;

    const user = await this.userService.findUser(socket);

    // We want to preserve original player position in the list.
    // That's the reason why we can't use default push() here.
    //
    // Example: [P1, null, null, P2] -> [P1, P3, null, P2]
    for (let i = 0; i < members.list.length; i++) {
      if (members.list[i]) continue;

      members.list[i] = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.getTime(),
        color: game.layout.colors[i],
        joinedAt: Date.now(),
      };

      members.count++;

      break;
    }

    this.redisService.set(id, game);

    await socket.join(id);

    return game.info;
  }

  async removeMember(socket: Socket, game: CachedGame): Promise<GameInfo> {
    const { id, members } = game.info;

    const user = await this.userService.findUser(socket);

    // We want to preserve original player position in the list.
    //
    // Example: [P1, P3, null, P2] -> [null, P3, null, P2]
    for (let i = members.list.length - 1; i >= 0; i--) {
      if (members.list[i]?.id !== user.id) continue;

      members.list[i] = null;
      members.count--;
    }

    // Handle the case when all members left the game.
    if (members.count === 0) {
      game.status = GameStatus.Cancelled;

      this.redisService.delete(id);
    } else {
      this.redisService.set(id, game);
    }

    await socket.leave(id);

    return game.info;
  }

  async moveMember(
    game: CachedGame,
    message: ChatMessage,
  ): Promise<NextPosition> {
    const memberIndex = game.info.members.list.findIndex((member) => {
      return member && member.id === message.member.id;
    });

    if (!game.positions[memberIndex]) {
      throw new Error('Member is not found!');
    }

    const oldPosition = game.positions[memberIndex];
    const oldType = game.layout.maze[oldPosition.y][oldPosition.x];

    const newPosition = { ...oldPosition };

    switch (message.content) {
      case 'up':
        newPosition.y--;
        break;

      case 'down':
        newPosition.y++;
        break;

      case 'left':
        newPosition.x--;
        break;

      case 'right':
        newPosition.x++;
    }

    newPosition.x = Math.min(
      Math.max(0, newPosition.x),
      game.info.config.columns * 2,
    );

    newPosition.y = Math.min(
      Math.max(0, newPosition.y),
      game.info.config.rows * 2,
    );

    const newType = game.layout.maze[newPosition.y][newPosition.x];

    if (newType !== MazeCellType.Wall) {
      game.positions[memberIndex] = newPosition;

      this.redisService.set(game.info.id, game);
    }

    return {
      old: {
        position: oldPosition,
        type: oldType,
      },
      new: {
        position: newPosition,
        type: newType,
      },
    };
  }

  async getCachedGameById(id: string): Promise<CachedGame> {
    const game = await this.redisService.get<CachedGame>(id);

    if (game) return game;

    throw new Error('Game was not found!');
  }
}
