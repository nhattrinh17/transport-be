import { IsOptional, IsString } from 'class-validator';

export class QueryDashboardDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  unit?: string;
}
