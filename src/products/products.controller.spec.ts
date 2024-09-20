import { Test, TestingModule } from '@nestjs/testing';

import { PaginatedBrandProductResponseDto } from './dto/brand-product-response.dto';
import { GetBrandProductsDto } from './dto/get-brand-products.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
            getBrandProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('로그인하지 않은 사용자, 상품 목록을 반환', async () => {
      const query: GetProductsQueryDto = { page: 1, limit: 10 };
      const mockResponse: PaginatedProductResponseDto = {
        products: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: '상품1',
            description: '설명1',
            brand: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              krName: '브랜드1',
              enName: 'Brand1',
            },
          },
        ],
        pagination: { totalCount: 1, currentPage: 1, totalPages: 1, limit: 10 },
      };

      jest.spyOn(productsService, 'getProducts').mockResolvedValue(mockResponse);

      const result = await controller.getProducts(query, { user: null });

      expect(result).toEqual(mockResponse);
      expect(productsService.getProducts).toHaveBeenCalledWith(query, null);
    });

    it('로그인한 사용자, 상품 목록 반환', async () => {
      const query: GetProductsQueryDto = { page: 1, limit: 10 };
      const mockUser = {
        sub: '123e4567-e89b-12d3-a456-426614174002',
        email: 'user@example.com',
        username: 'user',
      };
      const mockResponse: PaginatedProductResponseDto = {
        products: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            name: '상품1',
            description: '설명1',
            brand: {
              id: '123e4567-e89b-12d3-a456-426614174004',
              krName: '브랜드1',
              enName: 'Brand1',
            },
            basePrice: 1000,
            userTypePrice: 900,
            finalPrice: 850,
            totalDiscountRate: 15,
          },
        ],
        pagination: { totalCount: 1, currentPage: 1, totalPages: 1, limit: 10 },
      };

      jest.spyOn(productsService, 'getProducts').mockResolvedValue(mockResponse);

      const result = await controller.getProducts(query, { user: mockUser });

      expect(result).toEqual(mockResponse);
      expect(productsService.getProducts).toHaveBeenCalledWith(query, mockUser);
    });
  });

  describe('getBrandProducts', () => {
    it('특정 브랜드의 상품 목록 페이지네이션하여 반환', async () => {
      const query: GetBrandProductsDto = { brandName: '브랜드1', page: 1, limit: 10 };
      const mockResponse: PaginatedBrandProductResponseDto = {
        products: [
          {
            id: '123e4567-e89b-12d3-a456-426614174005',
            name: '상품1',
            description: '설명1',
            brand: {
              id: '123e4567-e89b-12d3-a456-426614174006',
              krName: '브랜드1',
              enName: 'Brand1',
            },
            basePrice: 1000,
            finalPrice: 850,
            totalDiscountRate: 15,
          },
        ],
        pagination: { totalCount: 1, currentPage: 1, totalPages: 1, limit: 10 },
      };

      jest.spyOn(productsService, 'getBrandProducts').mockResolvedValue(mockResponse);

      const result = await controller.getBrandProducts(query);

      expect(result).toEqual(mockResponse);
      expect(productsService.getBrandProducts).toHaveBeenCalledWith(query);
    });
  });
});
