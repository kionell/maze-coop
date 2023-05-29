import { IUser } from '@common/interfaces/user.interface';
import { SocketService } from './SocketService';

type UserEventListener = (user: IUser) => void;

export class UserService extends SocketService {
  constructor() {
    super('/users');
  }

  async create(username: string): Promise<void> {
    this.socket.emit('create_user', username);
  }

  async find(): Promise<void> {
    this.socket.emit('find_user');
  }

  async logout(): Promise<void> {
    this.socket.emit('logout_user');
  }

  onUserCreated(listener: UserEventListener): void {
    this.socket.on('user_created', listener);
  }

  onUserFound(listener: UserEventListener): void {
    this.socket.on('user_found', listener);
  }

  onUserNotFound(listener: UserEventListener): void {
    this.socket.on('user_not_found_error', listener);
  }

  onUserLogout(listener: UserEventListener): void {
    this.socket.on('user_logout', listener);
  }

  offUserCreated(listener?: UserEventListener): void {
    this.socket.off('user_created', listener);
  }

  offUserFound(listener?: UserEventListener): void {
    this.socket.off('user_found', listener);
  }

  offUserNotFound(listener?: UserEventListener): void {
    this.socket.off('user_not_found_error', listener);
  }

  offUserLogout(listener?: UserEventListener): void {
    this.socket.off('user_logout', listener);
  }

  removeAllListeners(): void {
    this.offUserCreated();
    this.offUserFound();
    this.offUserNotFound();
    this.offUserLogout();
  }
}

export const userService = new UserService();
