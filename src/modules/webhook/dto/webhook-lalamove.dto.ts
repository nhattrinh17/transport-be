import { ApiProperty } from '@nestjs/swagger';

class PriceOrderLalamove {
  @ApiProperty({ name: 'subTotal', type: Number, description: 'Tổng tiền', example: 100000 })
  subTotal: number;

  @ApiProperty({ name: 'priorityFee', type: Number, description: 'Phí ưu tiên', example: 10000 })
  priorityFee: number;

  @ApiProperty({ name: 'totalPrice', type: Number, description: 'Tổng phí', example: 110000 })
  totalPrice: number;
}

class OrderData {
  @ApiProperty({ name: 'orderId', type: String, description: 'Mã đơn hàng', example: 'order_test' })
  orderId: string;

  @ApiProperty({ name: 'market', type: String, description: 'Thị trường', example: 'VN' })
  market: string;

  @ApiProperty({ name: 'driverId', type: String, description: 'Id tài xế', example: 'driverId_test' })
  driverId: string;

  @ApiProperty({ name: 'shareLink', type: String, description: 'Link chia sẻ', example: 'https://lalamove.com/sharelink' })
  shareLink: string;

  @ApiProperty({ name: 'status', type: String, description: 'Trạng thái đơn hàng', example: 'ORDER_STATUS_CHANGED' })
  status: 'ASSIGNING_DRIVER' | 'ON_GOING' | 'PICKED_UP' | 'COMPLETED' | 'CANCELED' | 'REJECTED' | 'EXPIRED';

  @ApiProperty({ name: 'previousStatus', type: String, description: 'Trạng thái trước đó', example: 'ORDER_STATUS_CHANGED' })
  previousStatus: 'ASSIGNING_DRIVER' | 'ON_GOING' | 'PICKED_UP' | 'COMPLETED' | 'CANCELED' | 'REJECTED' | 'EXPIRED';

  @ApiProperty({ name: 'price', type: PriceOrderLalamove, description: 'Giá đơn hàng bị thay đổi', example: { subTotal: 100000, priorityFee: 10000, totalPrice: 110000 } })
  price: PriceOrderLalamove;

  @ApiProperty({ name: 'createdAt', type: String, description: 'Thời gian tạo đơn hàng', example: '2023-10-01T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ name: 'scheduledAt', type: String, description: 'Thời gian dự kiến', example: '2023-10-01T00:00:00Z' })
  scheduledAt: string;
}

export class DataDriverWWebhookLalamove {
  @ApiProperty({ name: 'driverId', type: String, description: 'Id tài xế', example: 'driverId_test' })
  driverId: string;

  @ApiProperty({ name: 'name', type: String, description: 'Tên tài xế', example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ name: 'phone', type: String, description: 'Số điện thoại tài xế', example: '0987654321' })
  phone: string;

  @ApiProperty({ name: 'plateNumber', type: String, description: 'Biển số xe', example: '29A-12345' })
  plateNumber: string;

  @ApiProperty({ name: 'photo', type: String, description: 'URL ảnh đại diện tài xế', example: 'https://example.com/photo.jpg' })
  photo: string;
}

export class DataLocationDriverLalamove {
  @ApiProperty({ name: 'lat', type: Number, description: 'Vĩ độ', example: 10.762622 })
  lat: number;

  @ApiProperty({ name: 'lng', type: Number, description: 'Kinh độ', example: 106.660172 })
  lng: number;
}

export class DataWWebhookLalamove {
  @ApiProperty({ name: 'order', type: OrderData, description: 'Dữ liệu đơn hàng' })
  order: OrderData;

  @ApiProperty({ name: 'driver', type: DataDriverWWebhookLalamove, description: 'Dữ liệu tài xế', example: { driverId: 'driverId_test', name: 'Nguyễn Văn A', phone: '0987654321', plateNumber: '29A-12345', photo: 'https://example.com/photo.jpg' } })
  driver: DataDriverWWebhookLalamove;

  @ApiProperty({ name: 'location', type: DataLocationDriverLalamove, description: 'Vị trí tài xế', example: { lat: 10.762622, lng: 106.660172 } })
  location: DataLocationDriverLalamove;

  @ApiProperty({ name: 'prevOrderId', type: String, description: 'Mã đơn hàng trước đó', example: 'order_test' })
  prevOrderId: string;

  @ApiProperty({ name: 'updatedAt', type: String, description: 'Thời gian cập nhật', example: '2023-10-01T00:00:00Z' })
  updatedAt: string;
}

export class WebhookLalamoveDto {
  @ApiProperty({ name: 'apiKey', type: String, description: 'API Key', example: 'api_key_tesst' })
  apiKey: string;

  @ApiProperty({ name: 'timestamp', type: Number, description: 'THời gian theo timestamp', example: 32132143432423 })
  timestamp: number;

  @ApiProperty({ name: 'signature', type: String, description: 'Chữ ký', example: 'signature_test' })
  signature: string;

  @ApiProperty({ name: 'eventId', type: String, description: 'Id Sự kiện', example: 'event_test' })
  eventId: string;

  @ApiProperty({ name: 'eventType', type: String, description: 'Loại sự kiện', example: 'event_test' })
  eventType: 'ORDER_STATUS_CHANGED' | 'DRIVER_ASSIGNED' | 'ORDER_AMOUNT_CHANGED' | 'ORDER_REPLACED' | 'WALLET_BALANCE_CHANGED' | 'ORDER_EDITED';

  @ApiProperty({ name: 'eventVersion', type: String, description: 'Thời gian sự kiện', example: '2023-10-01T00:00:00Z' })
  eventVersion: string;

  @ApiProperty({
    name: 'data',
    type: DataWWebhookLalamove,
    description: 'Dữ liệu đơn hàng',
    example: {
      orderId: 'order_test',
      market: 'VN',
      driverId: 'driverId_test',
      shareLink: 'https://lalamove.com/sharelink',
      status: 'ORDER_STATUS_CHANGED',
      previousStatus: 'ORDER_STATUS_CHANGED',
      createdAt: '2023-10-01T00:00:00Z',
      scheduledAt: '2023-10-01T00:00:00Z',
    },
  })
  data: DataWWebhookLalamove;
}
