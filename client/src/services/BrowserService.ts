import { BrowserMessage } from '@common/messages/BrowserMessage';
import { SocketService } from './SocketService';

type BrowserMessageListener = (msg: BrowserMessage) => void;

export class BrowserService extends SocketService {
  constructor() {
    super('/browse');
  }

  async browse(): Promise<BrowserMessage> {
    await this.connect();

    return new Promise((resolve) => {
      this.socket.once('browser_update', (msg) => resolve(msg));
      this.socket.emit('browse_games');
    });
  }

  onUpdate(listener: BrowserMessageListener): void {
    this.socket.on('browser_update', listener);
  }

  offUpdate(listener?: BrowserMessageListener): void {
    this.socket.off('browser_update', listener);
  }
}

export const browserService = new BrowserService();
