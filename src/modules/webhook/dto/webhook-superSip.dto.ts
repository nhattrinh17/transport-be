import { ApiProperty } from '@nestjs/swagger';

export class SuperShipWebhookDto {
  @ApiProperty({
    name: 'type',
    type: String,
    description: 'Loại cập nhật (update_status, update_weight)',
    example: 'update_status',
  })
  type: 'update_status' | 'update_weight';

  @ApiProperty({
    name: 'code',
    type: String,
    description: 'Mã đơn hàng của SuperShip',
    example: 'SGNS336484LM.883568271',
  })
  code: string;

  @ApiProperty({
    name: 'shortcode',
    type: String,
    description: 'Mã đơn ngắn của SuperShip',
    example: '883568271',
  })
  shortcode: string;

  @ApiProperty({
    name: 'soc',
    type: String,
    description: 'Mã đơn hàng của người gửi',
    example: 'JLN-1805-1456',
  })
  soc: string;

  @ApiProperty({
    name: 'phone',
    type: String,
    description: 'Số điện thoại của người nhận',
    example: '01629091355',
  })
  phone: string;

  @ApiProperty({
    name: 'address',
    type: String,
    description: 'Địa chỉ của người nhận',
    example: '47 Huỳnh Văn Bánh, Phường 5, Quận Phú Nhuận, TP.HCM',
  })
  address: string;

  @ApiProperty({
    name: 'amount',
    type: Number,
    description: 'Số tiền cần thu hộ (COD)',
    example: 450000,
  })
  amount: number;

  @ApiProperty({
    name: 'weight',
    type: Number,
    description: 'Khối lượng của đơn hàng (gram)',
    example: 200,
  })
  weight: number;

  @ApiProperty({
    name: 'fshipment',
    type: Number,
    description: 'Cước phí giao hàng',
    example: 25000,
  })
  fshipment: number;

  @ApiProperty({
    name: 'fshipment',
    type: Number,
    description: 'Cước phí bảo hiểm',
    example: 25000,
  })
  finsurance = 0;

  @ApiProperty({
    name: 'status',
    type: String,
    description: 'Mã trạng thái đơn hàng',
    example: '12',
  })
  status: string;

  @ApiProperty({
    name: 'status_name',
    type: String,
    description: 'Tên trạng thái đơn hàng',
    example: 'Đã Giao Hàng Toàn Bộ',
  })
  status_name: string;

  @ApiProperty({
    name: 'partial',
    type: String,
    description: 'Đơn đã giao một phần (1: Có, 0: Không)',
    example: '1',
  })
  partial: string;

  @ApiProperty({
    name: 'barter',
    type: String,
    description: 'Đơn có hàng đổi trả (1: Có, 0: Không)',
    example: '1',
  })
  barter: string;

  @ApiProperty({
    name: 'reason_code',
    type: String,
    description: 'Mã lý do cập nhật',
    example: '304',
  })
  reason_code: string;

  @ApiProperty({
    name: 'reason_text',
    type: String,
    description: 'Chi tiết lý do',
    example: 'Không liên lạc được với Người Nhận',
  })
  reason_text: string;

  @ApiProperty({
    name: 'created_at',
    type: String,
    description: 'Thời gian tạo đơn hàng (ISO 8601)',
    example: '2018-07-03T17:18:29+07:00',
  })
  created_at: string;

  @ApiProperty({
    name: 'updated_at',
    type: String,
    description: 'Thời gian cập nhật đơn hàng (ISO 8601)',
    example: '2018-07-03T17:18:29+07:00',
  })
  updated_at: string;

  @ApiProperty({
    name: 'pushed_at',
    type: String,
    description: 'Thời gian đẩy webhook (ISO 8601)',
    example: '2018-07-03T17:18:29+07:00',
  })
  pushed_at: string;
}
