import * as session from 'express-session';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import { Session } from './session.entity';

declare module 'http' {
  interface IncomingMessage {
    /**
     * This request's `Session` object.
     * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
     * [Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) can be used to add your own properties.
     *
     * @see SessionData
     */
    session: session.Session & Partial<session.SessionData>;

    /**
     * This request's session ID.
     * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
     */
    sessionID: string;

    /**
     * The Store in use.
     * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
     * The function `generate` is added by express-session
     */
    sessionStore: session.Store;
  }
}

export function sessionMiddlewareWrapper(app: INestApplication) {
  return session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      sameSite: false,
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 Year
    },
    store: new TypeormStore({
      repository: app.get(DataSource).getRepository(Session),
    }),
  });
}
