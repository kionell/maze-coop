import { GameCompact } from "../interfaces/GameCompact";
import { WebSocketMessage } from "./WebSocketMessage";

export type GameMessage = WebSocketMessage<GameCompact>;
