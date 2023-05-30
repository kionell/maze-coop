import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Session } from '../session/session.entity';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createUser(socket: Socket, username: string): Promise<User> {
    if (!socket.request.session) {
      throw new Error('Session is not found!');
    }

    const session = await this.sessionRepository.findOneBy({
      id: socket.request.sessionID,
    });

    const user = this.userRepository.create({
      games: [],
      username,
      session,
    });

    await this.userRepository.insert(user);

    if (session) {
      session.user = user;
      await session.save();
    }

    return user;
  }

  async findUser(socket: Socket): Promise<User | null> {
    if (!socket.request.session) {
      throw new Error('Session is not found!');
    }

    const session = await this.sessionRepository.findOne({
      where: {
        id: socket.request.sessionID,
      },
      relations: ['user'],
    });

    if (!session.user) {
      return null;
    }

    const user = await this.userRepository.findOneBy({
      id: session.user.id,
    });

    if (!user) {
      throw new Error('User is not found!');
    }

    return user;
  }
}
