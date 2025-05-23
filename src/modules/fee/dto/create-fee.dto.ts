import { PaymentMethodOrder } from '@common/enums';
import { FeeProductType } from '@common/enums/fee.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFeeDto {}

export class ItemProductDto {
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
  quantity: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'weight', type: Number, description: 'Khối lượng sp' })
  weight: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'price', description: 'Giá trị sản phẩm', example: 1000 })
  price: number;
}

class ItemProductFast {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'price', type: Number, description: 'Giá trị sản phẩm với ghn tối đa là 5tr ' })
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'moneyCollection', type: Number, description: 'Giá trị sản phẩm với ghn tối đa là 5tr ' })
  moneyCollection: number;

  @IsNumberString()
  @ApiProperty({ name: 'quantity', type: String, description: 'Số lượng sp' })
  quantity: string;

  @IsString()
  @ApiProperty({ name: 'type', type: String, description: 'Loại sản phẩm' })
  type: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'weigh', type: Number, description: 'Giá trị sản phẩm với ghn tối đa là 5tr ' })
  weigh: number;

  @IsArray()
  @ApiProperty({ name: 'categories', type: [String], description: 'Danh mục sản phẩm' })
  categories: string[];

  @IsArray()
  @ApiProperty({ name: 'handlingInstructions', type: [String], description: 'Danh mục sản phẩm' })
  handlingInstructions: string[];
}

class Coordinates {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'lat', type: Number, description: 'Kinh độ' })
  lat: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'long', type: Number, description: 'Vĩ độ' })
  long: string;
}

class ItemStopFast {
  @IsObject()
  @ApiProperty({ name: 'coordinates', type: Coordinates, description: 'Chiều cao sp' })
  coordinates: Coordinates;

  @IsString()
  @ApiProperty({ name: 'address', type: String, description: 'Địa chỉ' })
  address: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'provinceId', type: String, description: 'Mã tỉnh gửi hàng' })
  provinceId: number;

  @IsString()
  @ApiProperty({ name: 'province', type: String, description: 'Tên tỉnh gửi hàng' })
  province: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'districtId', type: String, description: 'Mã quận huyện gửi hàng' })
  districtId: string;

  @IsString()
  @ApiProperty({ name: 'district', type: String, description: 'Tên quận huyện gửi hàng' })
  district: string;
}
export class GetFeeDto {
  @IsString()
  @ApiProperty({ name: 'serviceCodeViettel', type: String, description: 'Mã dịch vụ' })
  serviceCodeViettel: string;

  @IsEnum(PaymentMethodOrder)
  @ApiProperty({ name: 'paymentMethod', description: 'Hình thức thanh toán', enum: PaymentMethodOrder })
  paymentMethod: PaymentMethodOrder;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'serviceTypeGHN', type: Number, description: 'Mã dịch vụ' })
  serviceTypeGHN: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'serviceTypeNT', type: Number, description: 'Mã dịch vụ' })
  serviceTypeNT: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderProvince', type: Number, description: 'Mã tỉnh thành gửi hàng' })
  senderProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrict', type: Number, description: 'Mã quận huyện gửi hàng' })
  senderDistrict: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'senderDistrictGHN', type: Number, description: 'Mã quận huyện gửi hàng GHN' })
  senderDistrictGHN: number;

  @IsString()
  @ApiProperty({ name: 'senderWardCodeGHN', type: String, description: 'Mã quận huyện gửi hàng GHN' })
  senderWardCodeGHN: string;

  @IsString()
  @ApiProperty({ name: 'senderProvinceStr', type: String, description: 'Tên Tinh gửi hàng' })
  senderProvinceStr: string;

  @IsString()
  @ApiProperty({ name: 'senderDistrictStr', type: String, description: 'Tên Quận Huyện gửi hàng' })
  senderDistrictStr: string;

  @IsString()
  @ApiProperty({ name: 'senderWardStr', type: String, description: 'Tên Phường Xã gửi hàng' })
  senderWardStr: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverProvince', type: Number, description: 'Mã tỉnh thành nhận hàng' })
  receiverProvince: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrict', type: Number, description: 'Mã quận huyện nhận hàng' })
  receiverDistrict: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'receiverDistrictGHN', type: Number, description: 'Mã quận huyện nhận hàng GHN' })
  receiverDistrictGHN: number;

  @IsString()
  @ApiProperty({ name: 'receiverWardCodeGHN', type: String, description: 'Mã quận huyện nhận hàng GHN' })
  receiverWardCodeGHN: string;

  @IsString()
  @ApiProperty({ name: 'receiverProvinceStr', type: String, description: 'Tên Tinh gửi hàng' })
  receiverProvinceStr: string;

  @IsString()
  @ApiProperty({ name: 'receiverDistrictStr', type: String, description: 'Tên Quận Huyện gửi hàng' })
  receiverDistrictStr: string;

  @IsString()
  @ApiProperty({ name: 'receiverWardStr', type: String, description: 'Tên Phường Xã gửi hàng' })
  receiverWardStr: string;

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
  @ApiProperty({ name: 'items', type: [ItemProductDto], description: 'Danh sách sản phẩm' })
  items: ItemProductDto[];
}

export class GetFeeServiceFastDto {
  @IsString()
  @ApiProperty({ name: 'serviceType', type: String, description: 'Loại hình phương tiện' })
  serviceType: string;

  @IsArray()
  @ApiProperty({ name: 'specialRequestsLALA', type: [String], description: 'Yêu cầu đặc biệt' })
  specialRequestsLALA: string[];

  @IsString()
  @ApiProperty({ name: 'language', type: String, description: 'Ngôn ngữ' })
  language: string;

  @IsArray()
  @ApiProperty({ name: 'stops', type: [ItemStopFast], description: 'Danh sách điểm dừng' })
  stops: ItemStopFast[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ name: 'isRouteOptimized', type: Boolean, description: 'Ngôn ngữ' })
  isRouteOptimized: boolean;

  @IsObject()
  @ApiProperty({ name: 'item', type: ItemProductFast, description: 'Thông tin sản phẩm' })
  item: ItemProductFast;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'scheduleAt', type: String, description: 'THời gian nhận hàng' })
  scheduleAt: string;

  @IsEnum(PaymentMethodOrder)
  @ApiProperty({ name: 'paymentMethod', description: 'Hình thức thanh toán', enum: PaymentMethodOrder })
  paymentMethod: PaymentMethodOrder;
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
