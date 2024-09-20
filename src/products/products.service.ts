import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiscountDaysOfWeek } from '../entities/discount-days-of-week.entity';
import { DiscountPolicy } from '../entities/discount-policy.entity';
import { Product } from '../entities/product.entity';
import { UserTypeProductPrice } from '../entities/user-type-product-price.entity';
import { UserType } from '../entities/user-type.entity';

import { GetProductsQueryDto } from './dto/get-products-query.dto';
import {
  PaginatedProductResponseDto,
  ProductResponseDto,
  PaginationInfoDto,
} from './dto/paginated-product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(UserTypeProductPrice) private priceRepo: Repository<UserTypeProductPrice>,
    @InjectRepository(DiscountDaysOfWeek) private discountDaysRepo: Repository<DiscountDaysOfWeek>,
    @InjectRepository(DiscountPolicy) private discountPolicyRepo: Repository<DiscountPolicy>,
    @InjectRepository(UserType) private userTypeRepo: Repository<UserType>,
  ) {}

  /**
   * 상품 목록 조회 및 페이지네이션 response 반환
   * @param getProductsQueryDto
   * @param  user || null
   * @returns <PaginatedProductResponseDto>
   */
  async getProducts(
    getProductsQueryDto: GetProductsQueryDto,
    user: { sub: string; email: string; username: string } | null,
  ): Promise<PaginatedProductResponseDto> {
    const { page = 1, limit = 10 } = getProductsQueryDto; // query 값 없으면 기본 페이지: 1, 한 페이지당 항목 : 10 할당됨
    const skip = (page - 1) * limit;

    //상품 목록 조회 및 전체 개수 계산
    const [products, total] = await this.productRepo.findAndCount({
      skip,
      take: limit,
      relations: ['brand'],
    });

    //기본 할인 정책, 추가 할인율(요일 정책) 가져오기
    const [baseDiscountRate, additionalDiscount] = await this.getDiscountRates();

    //product data -> ProductResponseDto 형식으로 변환
    const productDtos: ProductResponseDto[] = await Promise.all(
      products.map((product) =>
        this.createProductResponseDto(product, user, additionalDiscount, baseDiscountRate),
      ),
    );

    const totalPages = Math.ceil(total / limit);

    //페이지 네이션 정보
    const paginationInfo: PaginationInfoDto = {
      totalCount: total,
      currentPage: page,
      totalPages,
      limit,
    };

    return {
      products: productDtos,
      pagination: paginationInfo,
    };
  }

  /**
   * 할인 정책 조회
   * return 기본 할인율, 요일별 추가 할인율
   */
  private async getDiscountRates(): Promise<[number, number]> {
    //요일별 할인율 조회
    const today = new Date().getDay();
    const discountDay = await this.discountDaysRepo.findOne({ where: { dayOfWeek: today } });
    const additionalDiscount = discountDay ? Number(discountDay.additionalDiscountRate) : 0;

    //현재 적용되고 있는 할인 정책 조회
    const discountPolicy = await this.discountPolicyRepo.findOne({ where: { isActive: true } });
    const baseDiscountRate = discountPolicy ? Number(discountPolicy.discountRate) : 0;

    return [baseDiscountRate, additionalDiscount];
  }

  //product response dto 처리
  private async createProductResponseDto(
    product: Product,
    user: { sub: string; email: string; username: string } | null,
    additionalDiscount: number,
    baseDiscountRate: number,
  ): Promise<ProductResponseDto> {
    //기본 응답 (로그인 유무와 상관없는, 가격 정보 포함x)
    const baseResponse: ProductResponseDto = {
      id: product.id,
      name: product.name,
      description: product.description,
      brand: {
        id: product.brand.id,
        krName: product.brand.krName,
        enName: product.brand.enName,
        description: product.brand.description,
      },
    };

    if (!user) {
      return baseResponse;
    }

    //UserType 조회
    const userType = await this.userTypeRepo.findOne({
      where: { name: user.sub },
    });

    if (!userType) {
      return baseResponse;
    }

    //usrType에 따른 가격 조회
    const userPrice = await this.priceRepo.findOne({
      where: { product: { id: product.id }, userType: { id: userType.id } },
    });

    //userType에 따른 가격이 있다면 그 가격 사용, 없다면 basePrice를 가격으로 계산
    const price = userPrice ? userPrice.price : product.basePrice;

    const totalDiscountRate = Math.min(
      product.maxDiscountRate,
      baseDiscountRate + additionalDiscount,
    ); // 적용가능한 할인 한도 내에서 할인율 적용

    const finalPrice = Math.round(price - (price * totalDiscountRate) / 100); //할인 정책이 적용되는 최종 가격, 반올림 적용

    return {
      ...baseResponse,
      basePrice: product.basePrice,
      userTypePrice: userPrice ? userPrice.price : undefined,
      finalPrice,
      totalDiscountRate,
    };
  }
}
