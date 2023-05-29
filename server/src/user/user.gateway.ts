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

  constructor(private userService: UserService) {}

  @SubscribeMessage('create_user')
  async createUser(@ConnectedSocket() socket: Socket, @MessageBody() username: string) {
    const user = await this.userService.createUser(socket.request.sessionID, username);

    socket.emit('user_created', user);
    console.log(`A new user created in the database: ${user.id} | ${user.username}`);
  }

  @SubscribeMessage('find_user')
  async findUser(@ConnectedSocket() socket: Socket) {
    const user = await this.userService.findUser(socket.request.sessionID);

    if (!user) {
      return socket.emit('user_not_found_error', {
        error: 'User was not found!',
      });
    }

    socket.emit('user_found', user);
  }

  @SubscribeMessage('logout_user')
  async logoutUser(@ConnectedSocket() socket: Socket) {
    socket.request.session.destroy((err) => {
      if (err) throw err;

      socket.emit('user_logout');
      console.log(`${socket.request.sessionID} logged out!`);
    });
  }
}

export { UserGateway };
