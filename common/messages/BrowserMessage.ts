import { GameInfo } from '../interfaces/GameInfo';
import { WebSocketMessage } from './WebSocketMessage';

export type BrowserMessage = WebSocketMessage<GameInfo[]>;
