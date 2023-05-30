import { IGame } from '@common/interfaces/game.interface';
import { WebsocketMessageDto } from '@common/dto/websocket-message.dto';
import { SocketService } from './SocketService';
import { browserService } from './BrowserService';

type GameEventListener = (message: WebsocketMessageDto<IGame>) => void;

export class GameService extends SocketService {
  constructor() {
    super('/games');
  }

  async create(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.once('game_created', async () => {
        await browserService.disconnect();
        await this.connect();

        resolve();
      });
      
      this.socket.emit('create_game');
    });
  }

  async join(hostId: string): Promise<void> {
    return new Promise((resolve) => {
      this.socket.once('game_joined', async () => {
        await browserService.disconnect();
        await this.connect();

        resolve();
      });
      
      this.socket.emit('join_game', hostId);
    });
  }

  async leave(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.once('game_cancelled', async () => {
        await this.disconnect();
        await browserService.connect();

        resolve();
      });
      
      this.socket.emit('leave_game');
    });
  }

  onCreate(listener: GameEventListener): void {
    this.socket.on('game_create', listener);
  }

  onJoin(listener: GameEventListener): void {
    this.socket.on('game_join', listener);
  }

  onCancel(listener: GameEventListener): void {
    this.socket.on('game_cancel', listener);
  }

  onFinish(listener: GameEventListener): void {
    this.socket.on('game_finish', listener);
  }

  offCreate(listener?: GameEventListener): void {
    this.socket.off('game_create', listener);
  }

  offJoin(listener?: GameEventListener): void {
    this.socket.off('game_join', listener);
  }

  offCancel(listener?: GameEventListener): void {
    this.socket.off('game_cancel', listener);
  }

  offFinish(listener?: GameEventListener): void {
    this.socket.off('game_finish', listener);
  }

  removeAllListeners(): void {
    this.offCreate();
    this.offJoin();
    this.offCancel();
    this.offFinish();
  }
}

export const gameService = new GameService();
