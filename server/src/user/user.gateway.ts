import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from './user.service';

@WebSocketGateway({ path: '/users' })
class UserGateway {
  @WebSocketServer()
  io: Server;

  constructor(private readonly userService: UserService) {}

  @SubscribeMessage('create_user')
  async createUser(@ConnectedSocket() socket: Socket, @MessageBody() username: string) {
    try {
      const user = await this.userService.createUser(socket, username);

      socket.emit('user_created', user);
      console.log(`A new user created in the database: ${user.id} | ${user.username}`);
    } catch {
      socket.emit('user_create_error', {
        error: 'Failed to create a user!',
      });
    }
  }

  @SubscribeMessage('find_user')
  async findUser(@ConnectedSocket() socket: Socket) {
    try {
      const user = await this.userService.findUser(socket);

      socket.emit('user_found', user);
    } catch {
      socket.emit('user_not_found_error', {
        error: 'User was not found!',
      });
    }
  }

  @SubscribeMessage('logout_user')
  async logoutUser(@ConnectedSocket() socket: Socket) {
    if (!socket.request.session) return;

    socket.request.session.destroy((err) => {
      if (err) throw err;

      socket.emit('user_logout');
      console.log(`${socket.request.sessionID} logged out!`);
    });
  }
}

export { UserGateway };
