import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { UserType } from './user-type.entity';

@Entity()
@Unique(['product', 'userType']) //각 상품별 사용자 유형에 따라 1개의 unique한 가격만 존재함
export class UserTypeProductPrice extends BaseEntity {
  @Column({ type: 'int' })
  price: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => UserType)
  @JoinColumn({ name: 'userTypeId' })
  userType: UserType;
}
