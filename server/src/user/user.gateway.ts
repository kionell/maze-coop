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
    let data = null;
    let error = null;

    try {
      data = await this.userService.createUser(socket, username);
    } catch {
      error = 'Failed to create a user';
    }

    socket.emit('user_create', { data, error });
  }

  @SubscribeMessage('find_user')
  async findUser(@ConnectedSocket() socket: Socket) {
    let data = null;
    let error = null;

    try {
      data = await this.userService.findUser(socket);
    } catch {
      error = 'User was not found';
    }

    socket.emit('user_find', { data, error });
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
