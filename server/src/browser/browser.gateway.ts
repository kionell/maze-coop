import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { BrowserService } from './browser.service';

@WebSocketGateway({ path: '/browse' })
class BrowserGateway {
  @WebSocketServer()
  io: Server;

  constructor(private readonly browserService: BrowserService) {}

  @SubscribeMessage('browse_games')
  async browseBrowsers(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      data = await this.browserService.getAvailableGames(socket);
    } catch (err: any) {
      error = 'Failed to get available browsers';
    } finally {
      socket.emit('browse_update', { data, error });
    }
  }
}

export { BrowserGateway };
