import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWarehouseDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'personCharge', type: String, example: 'Tên người phụ trách', description: 'Địa chỉ kho' })
  personCharge: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'phone', type: String, example: 'Số điện thoại', description: 'Tỉnh thành phố' })
  phone?: string;
}
