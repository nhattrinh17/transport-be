import { ConfigReceiveOrder, PaymentMethodOrder } from '@common/enums';
import { IsStringOrNumber } from '@common/pipes';
import { ItemProductDto } from '@modules/fee/dto/create-fee.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @ApiProperty({ name: 'unit', description: 'Đơn vị vận chuyển', example: 'Viettel Post' })
  unit: string;

  @IsString()
  @ApiProperty({ name: 'type', description: 'Hình thức vận chuyển', example: 'COD' })
  type: 'HT' | 'NORMAL';

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'quotationId', description: 'Id báo giá lalamove', example: 'VTP123456' })
  quotationId: string;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'serviceId', description: 'Loại dịch vụ vận chuyển', example: 'VTP123456' })
  serviceId: string | number;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'warehouseId', description: 'warehouseId', example: 'VTP123456' })
  warehouseId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'senderName', description: 'Têm shop or tên người gửi', example: 'COD' })
  senderName: string;

  @IsString()
  @IsPhoneNumber('VN')
  @ApiProperty({ name: 'senderPhone', description: 'Số điện thoại người gửi', example: 'COD' })
  senderPhone: string;

  @IsString()
  @ApiProperty({ name: 'senderAddress', description: 'Địa chỉ người gửi tong trường hợp là lavamove sẽ là stopId', example: '123 ABC,...' })
  senderAddress: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'senderProvince', description: 'Tỉnh thành phố', example: 'COD' })
  senderProvince: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'senderDistrict', description: 'Quận huyện', example: 'COD' })
  senderDistrict: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'senderWard', description: 'Phường xã', example: 'COD' })
  senderWard: string;

  @IsString()
  @ApiProperty({ name: 'receiverName', description: 'Tên người nhận', example: 'A B C' })
  receiverName: string;

  @IsString()
  @IsPhoneNumber('VN')
  @ApiProperty({ name: 'receiverPhone', description: 'Số điện thoại người nhận', example: '098868764' })
  receiverPhone: string;

  @IsString()
  @ApiProperty({ name: 'receiverAddress', description: 'Địa chỉ người nhận tong trường hợp là lavamove sẽ là stopId', example: '123 ABC,...' })
  receiverAddress: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'receiverProvince', description: 'Tỉnh thành phố', example: 'COD' })
  receiverProvince: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'receiverDistrict', description: 'Quận huyện', example: 'COD' })
  receiverDistrict: string;

  @IsStringOrNumber()
  @ApiProperty({ name: 'receiverWard', description: 'Phường xã', example: 'COD' })
  receiverWard: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'collection', description: 'Số tiền thu hộ', example: 1000 })
  collection: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'value', description: 'Giá trị đơn', example: 1000 })
  value: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'weight', description: 'Khối lượng (tính theo gam)', example: 1000 })
  weight: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'length', description: 'Chiều dài đơn hàng ', example: 1000 })
  length: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'width', description: 'Chiều rộng đơn hàng', example: 1000 })
  width: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({ name: 'height', description: 'Chiều cao đơn hàng', example: 1000 })
  height: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'note', description: 'Yêu cầu đi kèm', example: 'Ghi chú' })
  note: string;

  @IsEnum(ConfigReceiveOrder)
  @IsOptional()
  @ApiProperty({ name: 'configReceive', description: 'Cách thức nhận hàng', enum: ConfigReceiveOrder })
  configReceive: ConfigReceiveOrder;

  @IsEnum(PaymentMethodOrder)
  @IsOptional()
  @ApiProperty({ name: 'paymentMethod', description: 'Hình thức thanh toán', enum: PaymentMethodOrder })
  paymentMethod: PaymentMethodOrder;

  @IsArray()
  @ApiProperty({ name: 'items', description: 'Danh sách sản phẩm', type: [ItemProductDto] })
  items: ItemProductDto[];
}
