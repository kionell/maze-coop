import { UserCompact } from "../interfaces/UserCompact";
import { WebSocketMessage } from "./WebSocketMessage";

export type UserMessage = WebSocketMessage<UserCompact>;