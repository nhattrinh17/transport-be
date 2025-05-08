import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @ApiProperty({ name: 'name', type: String, example: 'Kho 1', description: 'Tên kho' })
  name: string;

  @IsString()
  @ApiProperty({ name: 'address', type: String, example: 'Địa chỉ kho 1', description: 'Địa chỉ kho' })
  address: string;

  @IsString()
  @ApiProperty({ name: 'province', type: String, example: 'Tỉnh thành phố', description: 'Tỉnh thành phố' })
  province?: string;

  @IsString()
  @ApiProperty({ name: 'district', type: String, example: 'Quận huyện', description: 'Quận huyện' })
  district?: string;

  @IsString()
  @ApiProperty({ name: 'ward', type: String, example: 'Phường xã', description: 'Phường xã' })
  ward?: string;

  @IsString()
  @ApiProperty({ name: 'phone', type: String, example: '0123456789', description: 'Số điện thoại kho' })
  phone: string;

  @IsString()
  @ApiProperty({ name: 'personCharge', type: String, example: 'Người phụ trách kho 1', description: 'Người phụ trách kho' })
  personCharge?: string;
}

export class CheckAndCreateWarehouseAndDetailDto extends CreateWarehouseDto {
  details: CreateWarehouseDetailDto[];
}

export class CreateWarehouseDetailDto {
  @IsString()
  @ApiProperty({ name: 'warehouseId', type: String, example: 'Id Kho', description: 'Id kho tại hệ thống' })
  warehouseId?: string;

  @IsString()
  @ApiProperty({ name: 'code', type: String, example: 'Mã kho(Mã shop) sẽ là lưu chung cho tất cả các đơn vị', description: 'Mã kho(Mã shop) sẽ là lưu chung cho tất cả các đơn vị' })
  code: string;

  @IsString()
  @ApiProperty({ name: 'type', type: String, example: 'Đơn vị vận chuyển', description: 'Loại kho' })
  type: string;

  @IsString()
  @ApiProperty({ name: 'cusId', type: String, example: 'ID người tạo', description: 'ID khách hàng' })
  cusId?: string;

  @IsString()
  @ApiProperty({ name: 'provinceId', type: String, example: 'ID tỉnh thành phố', description: 'ID tỉnh thành phố' })
  provinceId?: string;

  @IsString()
  @ApiProperty({ name: 'districtId', type: String, example: 'ID quận huyện', description: 'ID quận huyện' })
  districtId?: string;

  @IsString()
  @ApiProperty({ name: 'wardId', type: String, example: 'ID phường xã', description: 'ID phường xã' })
  wardId?: string;
}
