import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryOrderGetCountDto extends PaginationDto {
  @IsString()
  startDate: string;
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  unit?: string;
}

export class QueryOrderDto extends QueryOrderGetCountDto {
  @IsOptional()
  @IsString()
  status?: string;
  @IsOptional()
  @IsString()
  unit?: string;
  @IsOptional()
  @IsString()
  paymentMethod?: string;
  @IsOptional()
  @IsString()
  isPinter?: number;
  @IsOptional()
  @IsString()
  configReceive?: string;
}
