import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Session } from '../session/session.entity';
import { Game } from '../game/game.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @ManyToMany(() => Game, (game) => game.members)
  @JoinTable({
    name: 'game_members',
    joinColumn: {
      name: 'game_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  games: Game[];

  @OneToOne(() => Session, (session) => session.user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
