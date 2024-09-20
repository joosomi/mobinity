import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiscountDaysOfWeek } from '../entities/discount-days-of-week.entity';
import { DiscountPolicy } from '../entities/discount-policy.entity';
import { Product } from '../entities/product.entity';
import { UserTypeProductPrice } from '../entities/user-type-product-price.entity';
import { UserType } from '../entities/user-type.entity';

import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: Repository<Product>;
  let priceRepo: Repository<UserTypeProductPrice>;
  let discountDaysRepo: Repository<DiscountDaysOfWeek>;
  let discountPolicyRepo: Repository<DiscountPolicy>;
  let userTypeRepo: Repository<UserType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserTypeProductPrice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DiscountDaysOfWeek),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DiscountPolicy),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserType),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    priceRepo = module.get<Repository<UserTypeProductPrice>>(
      getRepositoryToken(UserTypeProductPrice),
    );
    discountDaysRepo = module.get<Repository<DiscountDaysOfWeek>>(
      getRepositoryToken(DiscountDaysOfWeek),
    );
    discountPolicyRepo = module.get<Repository<DiscountPolicy>>(getRepositoryToken(DiscountPolicy));
    userTypeRepo = module.get<Repository<UserType>>(getRepositoryToken(UserType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('비로그인 사용자, 상품 정보 페이지네이션하여 반환', async () => {
      const mockProducts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Product 1',
          description: 'Description 1',
          brand: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            krName: '브랜드1',
            enName: 'Brand1',
          },
          basePrice: 1000,
          maxDiscountRate: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Product[];
      jest.spyOn(productRepo, 'findAndCount').mockResolvedValue([mockProducts, 1]);
      jest
        .spyOn(
          service as unknown as { getDiscountRates: () => Promise<[number, number]> },
          'getDiscountRates',
        )
        .mockResolvedValue([0, 0]);

      const result = await service.getProducts({ page: 1, limit: 10 }, null);

      expect(result.products).toHaveLength(1);
      expect(result.products[0]).not.toHaveProperty('basePrice');
      expect(result.pagination.totalCount).toBe(1);
    });

    it('로그인 사용자, 상품 정보 페이지네이션하여 반환', async () => {
      const mockProducts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Product 1',
          description: 'Description 1',
          brand: {
            id: '123e4567-e89b-12d3-a456-426614174003',
            krName: '브랜드1',
            enName: 'Brand1',
          },
          basePrice: 1000,
          maxDiscountRate: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Product[];
      const mockUser = {
        sub: '123e4567-e89b-12d3-a456-426614174004',
        email: 'user1@example.com',
        username: 'user1',
      };

      const mockUserType = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        name: 'user1',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserType;

      // 사용자 유형별 제품 가격 정보
      const mockUserPrice = {
        price: 900,
        product: mockProducts[0],
        userType: mockUserType,
        id: '123e4567-e89b-12d3-a456-426614174006',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserTypeProductPrice;

      jest.spyOn(productRepo, 'findAndCount').mockResolvedValue([mockProducts, 1]);
      jest
        .spyOn(
          service as unknown as { getDiscountRates: () => Promise<[number, number]> },
          'getDiscountRates',
        )
        .mockResolvedValue([10, 5]);
      jest.spyOn(userTypeRepo, 'findOne').mockResolvedValue(mockUserType);
      jest.spyOn(priceRepo, 'findOne').mockResolvedValue(mockUserPrice);

      const result = await service.getProducts({ page: 1, limit: 10 }, mockUser);

      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toHaveProperty('basePrice', 1000);
      expect(result.products[0]).toHaveProperty('userTypePrice', 900);
      expect(result.products[0]).toHaveProperty('finalPrice', 765); // 900에서 15% 할인된 가격
      expect(result.products[0]).toHaveProperty('totalDiscountRate', 15);
    });
  });

  describe('getBrandProducts', () => {
    it('특정 브랜드의 상품들 페이지네이션하여 응답 반환', async () => {
      const mockProducts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174006',
          name: 'Product 1',
          description: 'Description 1',
          brand: {
            id: '123e4567-e89b-12d3-a456-426614174007',
            krName: '브랜드1',
            enName: 'Brand1',
          },
          basePrice: 1000,
          maxDiscountRate: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Product[];

      jest.spyOn(productRepo, 'findAndCount').mockResolvedValue([mockProducts, 1]);
      jest
        .spyOn(
          service as unknown as { getDiscountRates: () => Promise<[number, number]> },
          'getDiscountRates',
        )
        .mockResolvedValue([10, 5]);

      const result = await service.getBrandProducts({ brandName: '브랜드1', page: 1, limit: 10 });

      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toHaveProperty('basePrice', 1000);
      expect(result.products[0]).toHaveProperty('finalPrice', 850); // 1000 - (1000 * 0.15)
      expect(result.products[0]).toHaveProperty('totalDiscountRate', 15);
      expect(result.pagination.totalCount).toBe(1);
    });
  });

  describe('getDiscountRates', () => {
    it('현재 active한 할인 정책과 요일별 할인 정책이 있는지 확인 후 두 할인율 반환', async () => {
      jest.spyOn(discountPolicyRepo, 'findOne').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174008',
        discountRate: 10,
        name: 'Default Policy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DiscountPolicy);

      jest.spyOn(discountDaysRepo, 'findOne').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174009',
        additionalDiscountRate: 5,
        dayOfWeek: 1,
        discountPolicy: {} as DiscountPolicy,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DiscountDaysOfWeek);

      const getDiscountRates = (
        service as unknown as { getDiscountRates: () => Promise<[number, number]> }
      ).getDiscountRates.bind(service);
      const [baseRate, additionalRate] = await getDiscountRates();

      expect(baseRate).toBe(10);
      expect(additionalRate).toBe(5);
    });

    it('할인 정책이 없는 경우', async () => {
      jest.spyOn(discountDaysRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(discountPolicyRepo, 'findOne').mockResolvedValue(null);

      const getDiscountRates = (
        service as unknown as { getDiscountRates: () => Promise<[number, number]> }
      ).getDiscountRates.bind(service);
      const [baseRate, additionalRate] = await getDiscountRates();

      expect(baseRate).toBe(0);
      expect(additionalRate).toBe(0);
    });
  });
});
