import { ApiProperty } from '@nestjs/swagger';

export class GhtkOrderStatusDto {
  @ApiProperty({ name: 'label_id', type: String, description: 'Mã đơn hàng của hệ thống GHTK', example: 'S1621143677' })
  label_id: string;

  @ApiProperty({ name: 'partner_id', type: String, description: 'Mã đơn hàng thuộc hệ thống của đối tác', example: 'DH001XYZ' })
  partner_id: string;

  @ApiProperty({ name: 'status_id', type: Number, description: 'Mã trạng thái đơn hàng', example: 5 })
  status_id: number;

  @ApiProperty({ name: 'action_time', type: String, description: 'Thời gian cập nhật trạng thái đơn hàng (ISO 8601)', example: '2025-05-13T08:30:00Z' })
  action_time: string;

  @ApiProperty({ name: 'reason_code', type: String, description: 'Mã lý do cập nhật', example: '130' })
  reason_code: string;

  @ApiProperty({ name: 'reason', type: String, description: 'Lý do chi tiết cập nhật', example: 'Người nhận không đồng ý nhận sản phẩm' })
  reason: string;

  @ApiProperty({ name: 'weight', type: Number, description: 'Khối lượng đơn hàng tính theo kilogram', example: 1.5 })
  weight: number;

  @ApiProperty({ name: 'fee', type: Number, description: 'Phí ship của đơn hàng (VNĐ)', example: 35000 })
  fee: number;

  @ApiProperty({ name: 'return_part_package', type: Number, description: 'Nếu bằng 1 là đơn giao hàng một phần', example: 0 })
  return_part_package: number;
}
