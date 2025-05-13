import { ApiProperty } from '@nestjs/swagger';

export class WebhookGHNDto {
  @ApiProperty({ name: 'CODAmount', type: Number, description: 'Tiền thu hộ.', example: 3000000 })
  CODAmount: number;

  @ApiProperty({ name: 'CODTransferDate', type: String, description: 'Ngày chuyển tiền thu hộ.', example: null })
  CODTransferDate: string | null;

  @ApiProperty({ name: 'ClientOrderCode', type: String, description: 'Mã đơn hàng riêng của Khách hàng.', example: '' })
  ClientOrderCode: string;

  @ApiProperty({ name: 'ConvertedWeight', type: Number, description: 'Khối lượng quy đổi.', example: 200 })
  ConvertedWeight: number;

  @ApiProperty({ name: 'Description', type: String, description: 'Mô tả.', example: 'Tạo đơn hàng' })
  Description: string;

  @ApiProperty({
    name: 'Fee',
    type: Object,
    description: 'Phí.',
    example: {
      CODFailedFee: 0,
      CODFee: 0,
      Coupon: 0,
      DeliverRemoteAreasFee: 0,
      DocumentReturn: 0,
      DoubleCheck: 0,
      Insurance: 17500,
      MainService: 53900,
      PickRemoteAreasFee: 53900,
      R2S: 0,
      Return: 0,
      StationDO: 0,
      StationPU: 0,
      Total: 0,
    },
  })
  Fee: {
    CODFailedFee: number;
    CODFee: number;
    Coupon: number;
    DeliverRemoteAreasFee: number;
    DocumentReturn: number;
    DoubleCheck: number;
    Insurance: number;
    MainService: number;
    PickRemoteAreasFee: number;
    R2S: number;
    Return: number;
    StationDO: number;
    StationPU: number;
    Total: number;
  };

  @ApiProperty({ name: 'Height', type: Number, description: 'Chiều cao.', example: 10 })
  Height: number;

  @ApiProperty({ name: 'IsPartialReturn', type: Boolean, description: 'Đơn hàng giao 1 phần.', example: false })
  IsPartialReturn: boolean;

  @ApiProperty({ name: 'Length', type: Number, description: 'Chiều dài.', example: 10 })
  Length: number;

  @ApiProperty({ name: 'OrderCode', type: String, description: 'Mã vận đơn.', example: 'Z82BS' })
  OrderCode: string;

  @ApiProperty({ name: 'PartialReturnCode', type: String, description: 'Mã vận đơn giao 1 phần.', example: '' })
  PartialReturnCode: string;

  @ApiProperty({ name: 'PaymentType', type: Number, description: 'Mã người thanh toán phí dịch vụ.', example: 1 })
  PaymentType: number;

  @ApiProperty({ name: 'Reason', type: String, description: 'Lý do.', example: '' })
  Reason: string;

  @ApiProperty({ name: 'ReasonCode', type: String, description: 'Mã lý do.', example: '' })
  ReasonCode: string;

  @ApiProperty({ name: 'ShopID', type: Number, description: 'Mã cửa hàng.', example: 81558 })
  ShopID: number;

  @ApiProperty({ name: 'Status', type: String, description: 'Trạng thái đơn hàng.', example: 'ready_to_pick' })
  Status: string;

  @ApiProperty({ name: 'Time', type: String, format: 'date-time', description: 'Thời gian.', example: '2021-11-11T03:52:50.158Z' })
  Time: string;

  @ApiProperty({ name: 'TotalFee', type: Number, description: 'Tổng tiền phí dịch vụ.', example: 71400 })
  TotalFee: number;

  @ApiProperty({ name: 'Type', type: String, description: 'Loại.', example: 'create' })
  Type: string;

  @ApiProperty({ name: 'Warehouse', type: String, description: 'Bưu cục.', example: 'Bưu Cục 229 Quan Nhân-Q.Thanh Xuân-HN' })
  Warehouse: string;

  @ApiProperty({ name: 'Weight', type: Number, description: 'Cân nặng.', example: 10 })
  Weight: number;

  @ApiProperty({ name: 'Width', type: Number, description: 'Chiều rộng.', example: 10 })
  Width: number;
}
