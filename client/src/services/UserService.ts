import { IUser } from '@common/interfaces/user.interface';
import { WebsocketMessageDto } from '@common/dto/websocket-message.dto';
import { SocketService } from './SocketService';

type UserEventListener = (message: WebsocketMessageDto<IUser>) => void;

export class UserService extends SocketService {
  constructor() {
    super('/users');
  }

  async create(username: string): Promise<void> {
    await this.connect();

    this.socket.emit('create_user', username);
  }

  async find(): Promise<void> {
    await this.connect();

    this.socket.emit('find_user');
  }

  async logout(): Promise<void> {
    await this.connect();

    this.socket.emit('logout_user');
  }

  onCreate(listener: UserEventListener): void {
    this.socket.on('user_created', listener);
  }

  onFind(listener: UserEventListener): void {
    this.socket.on('user_found', listener);
  }

  onNotFound(listener: UserEventListener): void {
    this.socket.on('user_not_found_error', listener);
  }

  onLogout(listener: UserEventListener): void {
    this.socket.on('user_logout', listener);
  }

  offCreate(listener?: UserEventListener): void {
    this.socket.off('user_created', listener);
  }

  offFind(listener?: UserEventListener): void {
    this.socket.off('user_found', listener);
  }

  offNotFound(listener?: UserEventListener): void {
    this.socket.off('user_not_found_error', listener);
  }

  offLogout(listener?: UserEventListener): void {
    this.socket.off('user_logout', listener);
  }

  removeAllListeners(): void {
    this.offCreate();
    this.offFind();
    this.offNotFound();
    this.offLogout();
  }
}

export const userService = new UserService();
