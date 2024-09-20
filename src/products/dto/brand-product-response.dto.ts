export class BrandProductResponseDto {
  id: string;
  name: string;
  description: string;
  brand: {
    id: string;
    krName: string;
    enName: string;
  };
  basePrice: number;
  finalPrice: number; //할인된 가격
  totalDiscountRate: number;
}

export class PaginatedBrandProductResponseDto {
  products: BrandProductResponseDto[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
