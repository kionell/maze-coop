import { GameMessage } from '@common/messages/GameMessage';
import { GameConfig } from '@common/interfaces/GameConfig';
import { SocketService } from './SocketService';

type GameMessageListener = (msg: GameMessage) => void;

export class GameService extends SocketService {
  constructor() {
    super('/games');
  }

  async create(config: GameConfig): Promise<void> {
    await this.connect();

    this.socket.emit('create_game', config);
  }

  async join(id: string): Promise<void> {
    await this.connect();

    this.socket.emit('join_game', id);
  }

  async start(id: string): Promise<void> {
    await this.connect();

    this.socket.emit('start_game', id);
  }

  async leave(id: string): Promise<void> {
    await this.connect();

    this.socket.emit('leave_game', id);
  }

  onCreate(listener: GameMessageListener): void {
    this.socket.on('game_create', listener);
  }

  onJoin(listener: GameMessageListener): void {
    this.socket.on('game_join', listener);
  }

  onLeave(listener: GameMessageListener): void {
    this.socket.on('game_leave', listener);
  }

  onStart(listener: GameMessageListener): void {
    this.socket.on('game_start', listener);
  }

  onCancel(listener: GameMessageListener): void {
    this.socket.on('game_cancel', listener);
  }

  onFinish(listener: GameMessageListener): void {
    this.socket.on('game_finish', listener);
  }

  offCreate(listener?: GameMessageListener): void {
    this.socket.off('game_create', listener);
  }

  offJoin(listener?: GameMessageListener): void {
    this.socket.off('game_join', listener);
  }

  offLeave(listener?: GameMessageListener): void {
    this.socket.off('game_leave', listener);
  }  

  offStart(listener?: GameMessageListener): void {
    this.socket.off('game_start', listener);
  }

  offCancel(listener?: GameMessageListener): void {
    this.socket.off('game_cancel', listener);
  }

  offFinish(listener?: GameMessageListener): void {
    this.socket.off('game_finish', listener);
  }
}

export const gameService = new GameService();
