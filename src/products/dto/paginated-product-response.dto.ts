export class BrandDto {
  id: string;
  krName: string;
  enName: string;
  description?: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description?: string;
  basePrice?: number; //기본 상품 가격
  userTypePrice?: number; //사용자 유형별 가격
  finalPrice?: number; //할인된 금액
  totalDiscountRate?: number; //전체 할인율
  brand: BrandDto; //브랜드 정보 dto
}

export class PaginationInfoDto {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export class PaginatedProductResponseDto {
  products: ProductResponseDto[];
  pagination: PaginationInfoDto;
}
