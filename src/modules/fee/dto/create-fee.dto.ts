import { FeeProductType } from '@common/enums/fee.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeeDto {}

export class GetFeeDto {
  @IsString()
  @ApiProperty({ name: 'serviceCodeViettel', type: String, description: 'Mã dịch vụ' })
  serviceCodeViettel: string;

  @Transform(({ value }) => Number(value))
  @IsString()
  @ApiProperty({ name: 'serviceTypeGHN', type: Number, description: 'Mã dịch vụ' })
  serviceTypeGHN: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderProvince', type: Number, description: 'Mã tỉnh thành gửi hàng' })
  senderProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrict', type: Number, description: 'Mã quận huyện gửi hàng' })
  senderDistrict: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrictGHN', type: Number, description: 'Mã quận huyện gửi hàng GHN' })
  senderDistrictGHN: string;

  @IsString()
  @ApiProperty({ name: 'senderWardCodeGHN', type: Number, description: 'Mã quận huyện gửi hàng GHN' })
  senderWardCodeGHN: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverProvince', type: Number, description: 'Mã tỉnh thành nhận hàng' })
  receiverProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrict', type: Number, description: 'Mã quận huyện nhận hàng' })
  receiverDistrict: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrictGHN', type: Number, description: 'Mã quận huyện nhận hàng GHN' })
  receiverDistrictGHN: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverWardCodeGHN', type: Number, description: 'Mã quận huyện nhận hàng GHN' })
  receiverWardCodeGHN: string;

  @IsEnum(FeeProductType)
  @ApiProperty({ name: 'productType', enum: FeeProductType, description: 'Loại sản phẩm' })
  productType: FeeProductType;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productWeight', type: Number, description: 'Khối lượng sản phẩm với ghn thì tối đa là 1t6' })
  productWeight: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productLength', type: Number, description: 'Chiều dài đơn hàng với ghn tối đa là 2m' })
  productLength: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productWith', type: Number, description: 'Chiều rộng đơn hàng với ghn tối đa là 2m' })
  productWith: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productHeight', type: Number, description: 'Chiều cao đơn hàng với ghn tối đa là 2m' })
  productHeight: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productPrice', type: Number, description: 'Giá trị sản phẩm với ghn tối đa là 5tr ' })
  productPrice: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'moneyCollection', type: Number, description: 'Số tiền thu hộ với ghn tối đa là 10tr' })
  moneyCollection: number;

  @IsArray()
  @ApiProperty({ name: 'items', type: Array<ItemProduct>, isArray: true, description: 'Danh sách sản phẩm' })
  items: ItemProduct[];
}

class ItemProduct {
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên sp' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'code', type: String, description: 'Mã sp' })
  code: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'quantity', type: Number, description: 'Số lượng sp' })
  quantity: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'weight', type: Number, description: 'Khối lượng sp' })
  weight: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: string;
}

export class GetServiceAvailableDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderProvince', type: Number, description: 'Mã tỉnh thành gửi hàng' })
  senderProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrict', type: Number, description: 'Mã quận huyện gửi hàng' })
  senderDistrict: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrictGHN', type: Number, description: 'Mã quận huyện gửi hàng GHN' })
  senderDistrictGHN: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverProvince', type: Number, description: 'Mã tỉnh thành nhận hàng' })
  receiverProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrict', type: Number, description: 'Mã quận huyện nhận hàng' })
  receiverDistrict: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrictGHN', type: Number, description: 'Mã quận huyện nhận hàng GHN' })
  receiverDistrictGHN: string;

  @IsEnum(FeeProductType)
  @ApiProperty({ name: 'productType', enum: FeeProductType, description: 'Loại sản phẩm' })
  productType: FeeProductType;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productWeight', type: Number, description: 'Khối lượng sản phẩm' })
  productWeight: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'productPrice', type: Number, description: 'Giá trị sản phẩm' })
  productPrice: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'moneyCollection', type: Number, description: 'Số tiền thu hộ' })
  moneyCollection: number;
}
