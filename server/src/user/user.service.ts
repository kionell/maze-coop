import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Session } from '../session/session.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createUser(sessionID: string, username: string): Promise<User> {
    const session = await this.sessionRepository.findOneBy({
      id: sessionID,
    });

    const user = this.userRepository.create({
      sessions: [session],
      games: [],
      username,
    });

    await this.userRepository.insert(user);

    if (session) {
      session.user = user;
      await session.save();
    }

    return user;
  }

  async findUser(sessionID: string): Promise<User | null> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionID,
      },
      relations: ['user'],
    });

    if (!session.user) {
      return null;
    }

    return this.userRepository.findOneBy({
      id: session.user.id,
    });
  }
}
