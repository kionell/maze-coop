import { UserInfoMessage } from '@common/messages/UserInfoMessage';
import { SocketService } from './SocketService';

export class UserService extends SocketService {
  constructor() {
    super('/users');
  }

  async create(username: string): Promise<UserInfoMessage> {
    await this.connect();

    return new Promise((resolve) => {
      this.socket.once('user_create', (msg) => resolve(msg));
      this.socket.emit('create_user', username);
    });
  }

  async find(): Promise<UserInfoMessage> {
    await this.connect();

    return new Promise((resolve) => {
      this.socket.once('user_find', (msg) => resolve(msg));
      this.socket.emit('find_user');
    });
  }

  async logout(): Promise<void> {
    await this.connect();

    return new Promise((resolve) => {
      this.socket.once('user_logout', async () => {
        await userService.reconnect();

        resolve();
      });

      this.socket.emit('logout_user');
    });
  }
}

export const userService = new UserService();
