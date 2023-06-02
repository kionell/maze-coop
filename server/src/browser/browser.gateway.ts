import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { BrowserService } from './browser.service';
import { BrowserMessage } from '@common/messages/BrowserMessage';

@WebSocketGateway({ path: '/browse' })
class BrowserGateway {
  @WebSocketServer()
  io: Server;

  constructor(private readonly browserService: BrowserService) {}

  @SubscribeMessage('browse_games')
  async browseGames(@ConnectedSocket() socket: Socket) {
    socket.emit('browser_update', await this.getMessage());
  }

  async updateGames() {
    this.io.emit('browser_update', await this.getMessage());
  }

  private async getMessage(): Promise<BrowserMessage> {
    let data = null;
    let error = null;

    try {
      data = await this.browserService.getAvailableGames();
    } catch (err: any) {
      error = 'Failed to get available games';
    }

    return { data, error } as BrowserMessage;
  }
}

export { BrowserGateway };
