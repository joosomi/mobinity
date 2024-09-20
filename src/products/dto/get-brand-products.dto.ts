import { Type } from 'class-transformer';
import { IsString, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class GetBrandProductsDto {
  @IsString()
  @IsNotEmpty({ message: '검색할 브랜드 명을 입력해주세요' })
  brandName: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
