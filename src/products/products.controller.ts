import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductResponseDto } from './dto/paginated-product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard) //JWT 인증 선택적 적용 - 비로그인해도 접근 가능
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '상품 목록 조회',
    description: `상품 목록을 페이지네이션하여 조회합니다. 
                  로그인된 사용자의 경우 상품 기본 가격, 사용자 유형별 가격, 할인이 적용된 최종 가격, 총 할인율을 정보를 포함하여 반환됩니다.`,
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
}
