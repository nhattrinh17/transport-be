import { ApiProperty } from '@nestjs/swagger';

export class WebhookViettelDto {
  @ApiProperty({ name: 'ORDER_NUMBER', type: String, description: 'Mã đơn hàng', example: '10345381626' })
  ORDER_NUMBER: string;

  @ApiProperty({ name: 'ORDER_REFERENCE', type: String, description: 'Mã tham chiếu đơn hàng hệ thống', example: '10345381626' })
  ORDER_REFERENCE: string;

  @ApiProperty({ name: 'ORDER_STATUSDATE', type: String, description: 'Thời gian cập nhật trạng thái đơn hàng', example: '2023-10-01T10:00:00Z' })
  ORDER_STATUSDATE: string;

  @ApiProperty({ name: 'ORDER_STATUS', type: Number, description: 'Trạng thái đơn hàng', example: 200 })
  ORDER_STATUS: number;

  @ApiProperty({ name: 'NOTE', type: String, description: 'Ghi chú', example: 'Đơn hàng đã được giao thành công' })
  NOTE: string;

  @ApiProperty({ name: 'MONEY_COLLECTION', type: Number, description: 'Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)', example: 100000 })
  MONEY_COLLECTION: number;

  @ApiProperty({ name: 'MONEY_FEECOD', type: Number, description: 'Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)', example: 10000 })
  MONEY_FEECOD: number;

  @ApiProperty({ name: 'MONEY_TOTAL', type: Number, description: 'Tổng tiền bao gồm VAT' })
  MONEY_TOTAL: number;

  @ApiProperty({ name: 'EXPECTED_DELIVERY', type: String, description: 'Thời gian dự kiến giao hàng' })
  EXPECTED_DELIVERY: string;

  @ApiProperty({ name: 'PRODUCT_WEIGHT', type: Number, description: 'Trọng lượng sản phẩm' })
  PRODUCT_WEIGHT: number;

  @ApiProperty({ name: 'ORDER_SERVICE', type: String, description: 'Dịch vụ vận chuyển' })
  ORDER_SERVICE: string;

  @ApiProperty({ name: 'TOKEN', type: String, description: 'Token xác thực' })
  TOKEN: string;
}
