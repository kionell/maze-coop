import { GameStartMessage } from '@common/messages/GameStartMessage';
import { GameFinishMessage } from '@common/messages/GameFinishMessage';
import { GameInfoMessage } from '@common/messages/GameInfoMessage';
import { MemberListMessage } from '@common/messages/MemberListMessage';
import { NextTurnMessage } from '@common/messages/NextTurnMessage';
import { PositionMessage } from '@common/messages/PositionMessage';
import { GameConfig } from '@common/interfaces/GameConfig';
import { ChatMessage } from '@common/interfaces/ChatMessage';
import { SocketService } from './SocketService';

type GameStartMessageListener = (msg: GameStartMessage) => void;
type GameFinishMessageListener = (msg: GameFinishMessage) => void;
type GameInfoMessageListener = (msg: GameInfoMessage) => void;
type MemberListMessageListener = (msg: MemberListMessage) => void;
type NextTurnMessageListener = (msg: NextTurnMessage) => void;
type PositionMessageListener = (msg: PositionMessage) => void;

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

  async move(msg: ChatMessage): Promise<void> {
    await this.connect();

    this.socket.emit('game_set_position', msg);
  }

  onCreate(listener: GameInfoMessageListener): void {
    this.socket.on('game_create', listener);
  }

  onConnect(listener: GameInfoMessageListener): void {
    this.socket.on('game_connect', listener);
  }

  onJoin(listener: MemberListMessageListener): void {
    this.socket.on('game_join', listener);
  }

  onLeave(listener: MemberListMessageListener): void {
    this.socket.on('game_leave', listener);
  }

  onStart(listener: GameStartMessageListener): void {
    this.socket.on('game_start', listener);
  }

  onCancel(listener: GameFinishMessageListener): void {
    this.socket.on('game_cancel', listener);
  }

  onFinish(listener: GameFinishMessageListener): void {
    this.socket.on('game_finish', listener);
  }

  onNextTurn(listener: NextTurnMessageListener): void {
    this.socket.on('game_next_turn', listener);
  }

  onNextPosition(listener: PositionMessageListener): void {
    this.socket.on('game_next_position', listener);
  }

  offCreate(listener?: GameInfoMessageListener): void {
    this.socket.off('game_create', listener);
  }

  offConnect(listener?: GameInfoMessageListener): void {
    this.socket.off('game_connect', listener);
  }

  offJoin(listener?: MemberListMessageListener): void {
    this.socket.off('game_join', listener);
  }

  offLeave(listener?: MemberListMessageListener): void {
    this.socket.off('game_leave', listener);
  }  

  offStart(listener?: GameStartMessageListener): void {
    this.socket.off('game_start', listener);
  }

  offCancel(listener?: GameFinishMessageListener): void {
    this.socket.off('game_cancel', listener);
  }

  offFinish(listener?: GameFinishMessageListener): void {
    this.socket.off('game_finish', listener);
  }

  offNextTurn(listener?: NextTurnMessageListener): void {
    this.socket.off('game_next_turn', listener);
  }

  offNextPosition(listener?: PositionMessageListener): void {
    this.socket.off('game_next_position', listener);
  }
}

export const gameService = new GameService();
