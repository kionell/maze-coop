import { GameInfo } from '../interfaces/GameInfo';
import { WebSocketMessage } from './WebSocketMessage';

export type GameInfoMessage = WebSocketMessage<GameInfo>;
