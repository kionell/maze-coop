import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGateway } from './user.gateway';
import { User } from './user.entity';
import { Session } from '../session/session.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [UserGateway, UserService],
  exports: [UserService],
})
export class UserModule {}
