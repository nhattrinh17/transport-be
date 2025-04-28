import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProvinceDto {}

export class GetDistrictDto {
  @IsString()
  provinceIdViettel: string;

  @IsString()
  provinceIdGHN: string;
}

export class GetWardsDto {
  @IsString()
  districtIdViettel: string;

  @IsString()
  districtIdGHN: string;
}
