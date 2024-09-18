import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class Brand extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  krName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  enName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
