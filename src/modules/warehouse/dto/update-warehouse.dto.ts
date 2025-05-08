import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWarehouseDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'address', type: String, example: 'Địa chỉ kho 1', description: 'Địa chỉ kho' })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'province', type: String, example: 'Tỉnh thành phố', description: 'Tỉnh thành phố' })
  province?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'district', type: String, example: 'Quận huyện', description: 'Quận huyện' })
  district?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'ward', type: String, example: 'Phường xã', description: 'Phường xã' })
  ward?: string;
}
