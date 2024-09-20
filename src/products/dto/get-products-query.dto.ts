import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class GetProductsQueryDto {
  @IsOptional() // 값이 없어도 허용됨
  @Type(() => Number) // 값을 숫자로 변환
  @IsInt() // 정수
  @Min(1)
  page?: number = 1; // 페이지 번호 (기본값: 1)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10; // 페이지 당 항목 수 (기본값: 10)
}
