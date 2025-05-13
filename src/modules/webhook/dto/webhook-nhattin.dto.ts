import { ApiProperty } from '@nestjs/swagger';

export class NhatTinOrderStatusDto {
  @ApiProperty({
    name: 'bill_no',
    type: String,
    description: 'Mã vận đơn của Nhất Tín',
    example: 'NTX123456789',
  })
  bill_no: string;

  @ApiProperty({
    name: 'ref_code',
    type: String,
    description: 'Mã tham chiếu của khách hàng - có thể là số hóa đơn hoặc số đặt hàng',
    example: 'HD12345678',
  })
  ref_code: string;

  @ApiProperty({
    name: 'status_id',
    type: Number,
    description: 'Mã trạng thái (tham khảo phần Master Data)',
    example: 5,
  })
  status_id: number;

  @ApiProperty({
    name: 'status_name',
    type: String,
    description: 'Tên trạng thái (tham khảo phần Master Data)',
    example: 'Đã giao hàng',
  })
  status_name: string;

  @ApiProperty({
    name: 'status_time',
    type: Number,
    description: 'Thời điểm thay đổi trạng thái (timestamp giây)',
    example: 1715609200,
  })
  status_time: number;

  @ApiProperty({
    name: 'push_time',
    type: Number,
    description: 'Thời điểm đẩy thông tin sang đối tác (timestamp giây)',
    example: 1715609300,
  })
  push_time: number;

  @ApiProperty({
    name: 'shipping_fee',
    type: Number,
    description: 'Phí vận chuyển',
    example: 45000,
  })
  shipping_fee: number;

  @ApiProperty({
    name: 'is_partial',
    type: Number,
    description: 'Đơn hoàn về từ giao hàng 1 phần. 1: đúng, 0: không',
    example: 0,
  })
  is_partial: number;

  @ApiProperty({
    name: 'reason',
    type: String,
    description: 'Lý do nếu có từ Nhất Tín',
    example: 'Khách không nhận hàng',
  })
  reason: string;

  @ApiProperty({
    name: 'weight',
    type: Number,
    description: 'Trọng lượng hàng hóa (kg)',
    example: 1.2,
  })
  weight: number;

  @ApiProperty({
    name: 'dimension_weight',
    type: Number,
    description: 'Trọng lượng quy đổi hàng hóa (kg)',
    example: 1.5,
  })
  dimension_weight: number;

  @ApiProperty({
    name: 'length',
    type: Number,
    description: 'Chiều dài hàng hóa (cm)',
    example: 40,
  })
  length: number;

  @ApiProperty({
    name: 'width',
    type: Number,
    description: 'Chiều rộng hàng hóa (cm)',
    example: 30,
  })
  width: number;

  @ApiProperty({
    name: 'height',
    type: Number,
    description: 'Chiều cao hàng hóa (cm)',
    example: 20,
  })
  height: number;

  @ApiProperty({
    name: 'expected_at',
    type: String,
    description: 'Ngày giao hàng dự kiến (format: "YYYY-MM-DD HH:mm:ss")',
    example: '2024-08-01 12:20:00',
  })
  expected_at: string;
}
