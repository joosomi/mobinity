import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../../entities/brand.entity';
import { DiscountDaysOfWeek } from '../../entities/discount-days-of-week.entity';
import { DiscountPolicy } from '../../entities/discount-policy.entity';
import { Product } from '../../entities/product.entity';
import { UserTypeProductPrice } from '../../entities/user-type-product-price.entity';
import { UserType } from '../../entities/user-type.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(DiscountPolicy)
    private discountPolicyRepository: Repository<DiscountPolicy>,
    @InjectRepository(DiscountDaysOfWeek)
    private discountDaysOfWeekRepository: Repository<DiscountDaysOfWeek>,
    @InjectRepository(UserTypeProductPrice)
    private userTypeProductPriceRepository: Repository<UserTypeProductPrice>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed(count: number): Promise<void> {
    // UserType 시딩
    const userTypeNames = ['BRONZE', 'SILVER', 'GOLD', 'VIP'];
    for (const type of userTypeNames) {
      await this.userTypeRepository.save({ name: type });
    }

    const userTypes = await this.userTypeRepository.find(); // UserType 엔티티 가져오기

    // Brand 시딩
    for (let i = 0; i < count; i++) {
      await this.brandRepository.save({
        krName: `회사 ${i + 1}`, // 임의의 한국어 회사 이름 생성
        enName: faker.company.name(),
      });
    }

    // Product 시딩
    const brands = await this.brandRepository.find();
    for (let i = 0; i < count; i++) {
      await this.productRepository.save({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        basePrice: Math.floor(faker.number.int({ min: 1000, max: 1000000 })), // 소수점 제거
        brand: brands[Math.floor(Math.random() * brands.length)],
        maxDiscountRate: faker.number.int({ min: 0, max: 50 }),
      });
    }

    // DiscountPolicy(default) 시딩
    await this.discountPolicyRepository.save({
      name: 'Default Discount Policy',
      description: 'Monday Discount Policy',
      discountRate: 0,
      isActive: true,
    });

    // DiscountDaysOfWeek(월요일 할인 정책) 시딩
    const policy = await this.discountPolicyRepository.findOne({
      where: { name: 'Default Discount Policy' },
    });
    if (policy) {
      for (let i = 0; i < 7; i++) {
        await this.discountDaysOfWeekRepository.save({
          discountPolicy: policy,
          dayOfWeek: i,
          additionalDiscountRate: i === 1 ? 1 : 0, // Monday (1) : 1% 추가 할인 정책, 나머지 요일은 추가 할인율 0%
        });
      }
    }

    // UserTypeProductPrice 시딩
    const products = await this.productRepository.find();
    for (const product of products) {
      for (const userType of userTypes) {
        await this.userTypeProductPriceRepository.save({
          price: Math.floor(faker.number.int({ min: 1000, max: 1000000 })), // 소수점 제거
          product: product,
          userType: userType,
        });
      }
    }

    // User 시딩
    for (let i = 0; i < count; i++) {
      const randomUserType = userTypes[Math.floor(Math.random() * userTypes.length)];
      const user = new User(); // User 객체 생성
      user.username = faker.internet.userName();
      user.email = faker.internet.email();
      user.password = process.env.DEFAULT_USER_PASSWORD; // 환경 변수에서 비밀번호 가져오기
      user.userType = randomUserType;

      await user.hashPassword(); // 비밀번호 해시 처리
      await this.userRepository.save(user); // 해시된 비밀번호와 함께 사용자 저장
    }

    console.log('Seeding completed');
  }
}

export default DatabaseSeeder;
