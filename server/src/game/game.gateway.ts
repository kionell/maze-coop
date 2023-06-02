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
import { GameService } from './game.service';
import { BrowserGateway } from '../browser/browser.gateway';
import { UserService } from '../user/user.service';

@WebSocketGateway({ path: '/games' })
class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(
    private readonly userService: UserService,
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

  @SubscribeMessage('start_game')
  async startGame(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    try {
      const user = await this.userService.findUser(socket);
      const game = await this.gameService.getCachedGameById(id);

      // Only host can start the game.
      if (user.id !== game.info.metadata.hostId) return;

      const states = await this.gameService.startGame(game);

      // Send individual game state for each member.
      states.forEach((state) => {
        if (!state.member) return;

        this.io.to(state.member.id).emit('game_start', {
          data: state,
          error: null,
        });
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('join_game')
  async joinGame(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    try {
      const game = await this.gameService.getCachedGameById(id);
      const info = await this.gameService.addUserToGame(socket, game);

      socket.emit('game_connect', {
        data: info,
        error: null,
      });

      socket.broadcast.to(game.info.id).emit('game_join', {
        data: info.members,
        error: null,
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  @SubscribeMessage('leave_game')
  async leaveGame(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    try {
      const game = await this.gameService.getCachedGameById(id);
      const info = await this.gameService.removeUserFromGame(socket, game);

      this.io.to(game.info.id).emit('game_leave', {
        data: info.members,
        error: null,
      });

      this.browserGateway.updateGames();
    } catch {}
  }

  handleConnection(socket: Socket) {
    socket.on('disconnecting', () => {
      socket.rooms.forEach((roomId) => {
        if (roomId === socket.id) return;

        this.leaveGame(socket, roomId);
      });
    });
  }
}

export { GameGateway };
