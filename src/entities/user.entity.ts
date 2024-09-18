import * as bcrypt from 'bcrypt';
import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserType } from './user-type.entity';

@Entity()
export class User extends BaseEntity {
  private static readonly saltRounds = 10;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, User.saltRounds);
    }
  }

  @ManyToOne(() => UserType)
  @JoinColumn({ name: 'userTypeId' })
  userType: UserType;
}
