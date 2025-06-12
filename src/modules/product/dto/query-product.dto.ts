import { PaginationDto } from '@common/decorators';
import { IsOptional } from 'class-validator';

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  status?: string;
}
