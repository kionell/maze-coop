import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'games' })
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.games)
  @JoinColumn({ name: 'host_id' })
  host: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.games)
  @JoinTable({
    name: 'game_members',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'game_id',
    },
  })
  members: User[];
}
