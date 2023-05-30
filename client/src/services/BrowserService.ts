import { IGame } from '@common/interfaces/game.interface';
import { WebsocketMessageDto } from '@common/dto/websocket-message.dto';
import { SocketService } from './SocketService';

type BrowseEventListener = (message: WebsocketMessageDto<IGame[]>) => void;

export class BrowserService extends SocketService {
  constructor() {
    super('/browse');

    this.socket.once('connect', () => this.browse());
  }

  async browse(): Promise<void> {
    await this.connect();

    this.socket.emit('browse_rooms');
  }

  onUpdate(listener: BrowseEventListener): void {
    this.socket.on('browse_update', listener);
  }

  offUpdate(listener?: BrowseEventListener): void {
    this.socket.off('browse_update', listener);
  }

  removeAllListeners(): void {
    this.offUpdate();
  }
}

export const browserService = new BrowserService();
