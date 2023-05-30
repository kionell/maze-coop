import { IGame } from '@common/interfaces/game.interface';
import { WebsocketMessageDto } from '@common/dto/websocket-message.dto';
import { SocketService } from './SocketService';
import { roomService } from './RoomService';

type GameEventListener = (message: WebsocketMessageDto<IGame>) => void;

export class GameService extends SocketService {
  constructor() {
    super('/games');
  }

  async create(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.once('game_created', async () => {
        await roomService.disconnect();
        await this.connect();

        resolve();
      });
      
      this.socket.emit('create_game');
    });
  }

  async join(hostId: string): Promise<void> {
    return new Promise((resolve) => {
      this.socket.once('game_joined', async () => {
        await roomService.disconnect();
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
        await roomService.connect();

        resolve();
      });
      
      this.socket.emit('leave_game');
    });
  }

  onCreate(listener: GameEventListener): void {
    this.socket.on('game_created', listener);
  }

  onJoin(listener: GameEventListener): void {
    this.socket.on('game_joined', listener);
  }

  onCancel(listener: GameEventListener): void {
    this.socket.on('game_cancelled', listener);
  }

  onFinish(listener: GameEventListener): void {
    this.socket.on('game_finished', listener);
  }

  offCreate(listener?: GameEventListener): void {
    this.socket.off('game_created', listener);
  }

  offJoin(listener?: GameEventListener): void {
    this.socket.off('game_joined', listener);
  }

  offCancel(listener?: GameEventListener): void {
    this.socket.off('game_cancelled', listener);
  }

  offFinish(listener?: GameEventListener): void {
    this.socket.off('game_finished', listener);
  }

  removeAllListeners(): void {
    this.offCreate();
    this.offJoin();
    this.offCancel();
    this.offFinish();
  }
}

export const gameService = new GameService();
