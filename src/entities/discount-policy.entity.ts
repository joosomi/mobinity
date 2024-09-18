import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class DiscountPolicy extends BaseEntity {
  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discountRate: number; //할인율

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;
}
