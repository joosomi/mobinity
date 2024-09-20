import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Brand } from '../entities/brand.entity';
import { DiscountDaysOfWeek } from '../entities/discount-days-of-week.entity';
import { DiscountPolicy } from '../entities/discount-policy.entity';
import { Product } from '../entities/product.entity';
import { UserTypeProductPrice } from '../entities/user-type-product-price.entity';
import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Brand,
      User,
      UserTypeProductPrice,
      DiscountDaysOfWeek,
      DiscountPolicy,
      UserType,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
