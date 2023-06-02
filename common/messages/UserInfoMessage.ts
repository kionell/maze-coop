import { UserInfo } from '../interfaces/UserInfo';
import { WebSocketMessage } from './WebSocketMessage';

export type UserInfoMessage = WebSocketMessage<UserInfo>;
