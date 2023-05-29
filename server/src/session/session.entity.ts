import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { SessionEntity } from 'typeorm-store';
import { User } from '../user/user.entity';

@Entity({ name: 'sessions' })
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
