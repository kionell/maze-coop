import { io, Socket } from 'socket.io-client';

export abstract class SocketService {
  readonly namespace: string;

  readonly socket: Socket;

  constructor(namespace = '') {
    this.namespace = namespace;

    this.socket = io({
      path: namespace,
      withCredentials: true,
      closeOnBeforeunload: false,
      autoConnect: false,
    });

    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('connect', () => this.onConnect());
    this.socket.on('connect_error', (err) => this.onConnectError(err));

  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket.connected) {
        return resolve();
      }

      this.socket.once('connect_error', () => reject());
      this.socket.once('connect', () => resolve());
      this.socket.connect();
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.disconnected) {
        return resolve();
      }

      this.socket.once('disconnect', () => resolve());
      this.socket.disconnect();
    });
  }

  async reconnect(): Promise<void> {
    await this.disconnect();
    await this.connect();
  }

  onConnectError(err: unknown): void {
    console.log('Connection error: ', err);
  }

  onConnect(): void {
    console.log(`Connected to ${this.namespace}`);
  }

  onDisconnect(): void {
    console.log(`Disconnected from ${this.namespace}`);
  }
}
