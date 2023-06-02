import { GameState } from '../interfaces/GameState';
import { WebSocketMessage } from './WebSocketMessage';

export type GameStartMessage = WebSocketMessage<GameState>;
