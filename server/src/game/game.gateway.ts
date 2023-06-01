import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GameConfig } from '@common/interfaces/GameConfig';
import { GameStatus } from '@common/enums/GameStatus';
import { GameService } from './game.service';
import { BrowserGateway } from '../browser/browser.gateway';

@WebSocketGateway({ path: '/games' })
class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly browserGateway: BrowserGateway,
  ) {}

  @SubscribeMessage('create_game')
  async createGame(@ConnectedSocket() socket: Socket, @MessageBody() config: GameConfig) {
    let data = null;
    let error = null;

    try {
      data = await this.gameService.createGame(socket, config);
    } catch (err: any) {
      error = 'Failed to create a game';
    }

    socket.emit('game_create', { data, error });

    this.browserGateway.updateGames();
  }

  @SubscribeMessage('join_game')
  async joinGame(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    try {
      const game = await this.gameService.getGameById(id);
      const data = await this.gameService.addUserToGame(socket, game);

      this.io.to(game.id).emit('game_join', { error: null, data });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('start_game')
  async startGame(@MessageBody() id: string) {
    try {
      const game = await this.gameService.getGameById(id);
      const data = await this.gameService.startGame(game);

      this.io.to(game.id).emit('game_start', { error: null, data });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('leave_game')
  async leaveGame(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    try {
      const game = await this.gameService.getGameById(id);
      const data = await this.gameService.removeUserFromGame(socket, game);

      // Yeah, it's possible to continue the game even if there is only one player left.
      const event = data.status === GameStatus.Cancelled ? 'game_cancel' : 'game_leave';

      this.io.to(game.id).emit(event, { error: null, data });

      this.browserGateway.updateGames();
    } catch {}
  }

  handleConnection(socket: Socket) {
    socket.on('disconnecting', () => {
      socket.rooms.forEach((roomId) => {
        if (socket.id === roomId) return;

        this.leaveGame(socket, roomId);
      });
    });
  }
}

export { GameGateway };
