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
  basePrice?: number;
  userTypePrice?: number;
  finalPrice?: number;
  totalDiscountRate?: number;
  brand: BrandDto;
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
