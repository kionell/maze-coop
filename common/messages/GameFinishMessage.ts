import { GameWinner } from '../interfaces/GameWinner';
import { WebSocketMessage } from './WebSocketMessage';

export type GameFinishMessage = WebSocketMessage<GameWinner>;
