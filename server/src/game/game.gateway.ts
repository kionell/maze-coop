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

@WebSocketGateway({ path: '/games' })
class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(private readonly gameService: GameService) {}

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
  }

  @SubscribeMessage('join_game')
  async joinGame(@ConnectedSocket() socket: Socket, @MessageBody() hostId: string) {
    let data = null;
    let error = null;

    try {
      const game = await this.gameService.getGameById(hostId);

      data = await this.gameService.addUserToGame(socket, game);
    } catch (err: any) {
      error = 'Failed to join a game';
    } finally {
      this.io.emit('game_join', { data, error });
    }
  }

  @SubscribeMessage('leave_game')
  async leaveGame(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      const game = await this.gameService.getGameBySocket(socket);

      data = await this.gameService.removeUserFromGame(socket, game);
    } catch (err: any) {
      error = 'Failed to leave a game';
    } finally {
      this.io.emit('game_cancel', { data, error });
    }
  }

  async handleDisconnect(socket: Socket) {
    return this.leaveGame(socket);
  }
}

export { GameGateway };
