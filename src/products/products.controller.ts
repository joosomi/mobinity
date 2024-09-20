import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

import { PaginatedBrandProductResponseDto } from './dto/brand-product-response.dto';
import { GetBrandProductsDto } from './dto/get-brand-products.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * 상품 목록 조회
   * @param getProductsQueryDto
   * @param req
   * @returns <PaginatedProductResponseDto>
   */
  @Get()
  @UseGuards(OptionalJwtAuthGuard) //JWT 인증 선택적 적용 - 비로그인해도 접근 가능
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '상품 목록 조회',
    description: `상품 목록을 페이지네이션하여 조회합니다. 
                  로그인된 사용자의 경우, 상품의 기본 가격, 사용자 유형별 상품 가격, 할인이 적용된 최종 가격, 총 할인율 정보를 포함하여 반환합니다.`,
  })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본값: 1)', example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 당 항목 수 (기본값: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 상품 목록 조회, 페이지네이션 정보를 포함한 응답 반환.',
    type: PaginatedProductResponseDto,
  })
  async getProducts(
    @Query() getProductsQueryDto: GetProductsQueryDto,
    @Request() req,
  ): Promise<PaginatedProductResponseDto> {
    const user = req.user || null; // 로그인되지 않은 경우 user는 null
    return this.productsService.getProducts(getProductsQueryDto, user);
  }

  /**
   * 브랜드별 상품 목록 조회
   * @param getBrandProductsDto
   * @returns <PaginatedBrandProductResponseDto>
   */
  @Get('brand')
  @Public()
  @ApiOperation({
    summary: '브랜드별 상품 목록 조회',
    description: `브랜드 이름(한글 또는 영어)으로 검색하여 해당 브랜드에 속하는 상품 목록을 페이지네이션하여 조회합니다.
                  상품의 기본 금액, 할인된 금액, 전체 할인율, 상품 정보, 브랜드 정보를 반환합니다.`,
  })
  @ApiQuery({
    name: 'brandName',
    required: true,
    description:
      '조회할 브랜드의 이름입니다. 한글 또는 영어로 입력할 수 있습니다. 예시) 회사 1, 회사 2, 회사 3 ... ',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 당 항목 수 (기본값: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 브랜드별 상품 목록 조회, 페이지네이션 정보를 포함한 응답 반환.',
    type: PaginatedBrandProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '브랜드 명을 공백으로 검색한 경우 : "검색할 브랜드 명을 입력해주세요"',
  })
  async getBrandProducts(
    @Query() getBrandProductsDto: GetBrandProductsDto,
  ): Promise<PaginatedBrandProductResponseDto> {
    return this.productsService.getBrandProducts(getBrandProductsDto);
  }
}
