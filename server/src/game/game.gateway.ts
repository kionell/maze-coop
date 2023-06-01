import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GameService } from './game.service';
import { BrowserGateway } from '../browser/browser.gateway';

@WebSocketGateway({ path: '/games' })
class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly browserGateway: BrowserGateway,
  ) {}

  @SubscribeMessage('create_game')
  async createGame(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      data = await this.gameService.saveGame(socket);
    } catch (err: any) {
      error = 'Failed to create a game';
    } finally {
      socket.broadcast.emit('game_create', { data, error });
    }

    this.browserGateway.updateGames();
  }

  @SubscribeMessage('join_game')
  async joinGame(@ConnectedSocket() socket: Socket, @MessageBody() hostId: string) {
    try {
      const game = await this.gameService.getGameById(hostId);
      const data = await this.gameService.addUserToGame(socket, game);

      this.io.to(game.metadata.hostId).emit('game_join', {
        error: null,
        data,
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('start_game')
  async startGame(@MessageBody() hostId: string) {
    try {
      const game = await this.gameService.getGameById(hostId);
      const data = await this.gameService.startGame(game);

      this.io.to(game.metadata.hostId).emit('game_start', {
        error: null,
        data,
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('leave_game')
  async leaveGame(@ConnectedSocket() socket: Socket, @MessageBody() hostId: string) {
    try {
      const game = await this.gameService.getGameById(hostId);
      const data = await this.gameService.removeUserFromGame(socket, game);

      this.io.to(game.metadata.hostId).emit('game_cancel', {
        error: null,
        data,
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  async handleDisconnect(socket: Socket) {
    return this.leaveGame(socket);
  }
}

export { GameGateway };
