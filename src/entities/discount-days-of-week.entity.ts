import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { BaseEntity } from './base.entity';
import { DiscountPolicy } from './discount-policy.entity';

@Entity()
@Unique(['discountPolicy', 'dayOfWeek']) // 할인 정책 별 각 요일에 하나의 추가 할인율만 존재하도록
export class DiscountDaysOfWeek extends BaseEntity {
  @ManyToOne(() => DiscountPolicy)
  @JoinColumn({ name: 'discount_policy_id' })
  discountPolicy: DiscountPolicy;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  additionalDiscountRate: number; //추가 할인율
}
