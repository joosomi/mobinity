import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Brand } from './brand.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  basePrice: number; //한국 원화 기준 - int로 설정 (소수점 이하 자리가 필요없음)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  maxDiscountRate: number; //상품의 최대 할인율 제한 필드 - 할인율을 0.00%에서 100.00%까지 표현

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
