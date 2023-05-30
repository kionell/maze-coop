import { IRoom } from '@common/interfaces/room.interface';
import { WebsocketMessageDto } from '@common/dto/websocket-message.dto';
import { SocketService } from './SocketService';

type RoomEventListener = (message: WebsocketMessageDto<IRoom[]>) => void;

export class RoomService extends SocketService {
  constructor() {
    super('/rooms');

    this.socket.once('connect', () => this.browse());
  }

  async browse(): Promise<void> {
    await this.connect();

    this.socket.emit('browse_rooms');
  }

  onUpdate(listener: RoomEventListener): void {
    this.socket.on('rooms_updated', listener);
  }

  offUpdate(listener?: RoomEventListener): void {
    this.socket.off('rooms_updated', listener);
  }

  removeAllListeners(): void {
    this.offUpdate();
  }
}

export const roomService = new RoomService();
