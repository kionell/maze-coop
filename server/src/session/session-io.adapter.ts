import { Server, ServerOptions } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { sessionMiddlewareWrapper } from './session.middleware';

export class SessionIoAdapter extends IoAdapter {
  private app: INestApplication;

  constructor(app: INestApplication) {
    super(app);

    this.app = app;
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    const session = sessionMiddlewareWrapper(this.app);

    this.app.use(session);

    server.engine.use(session);

    return server;
  }
}
