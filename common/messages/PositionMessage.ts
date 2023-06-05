import { NextPosition } from '../interfaces/NextPosition';
import { WebSocketMessage } from './WebSocketMessage';

export type PositionMessage = WebSocketMessage<NextPosition>;
