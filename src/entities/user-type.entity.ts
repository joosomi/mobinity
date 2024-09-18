import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base.entity';

// 사용자의 타입 설정

@Entity()
export class UserType extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
