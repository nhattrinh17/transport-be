export const StatusOrderLavaMove = [
  {
    status: 'ASSIGNING_DRIVER',
    name: 'Đang tìm tài xế',
  },
  {
    status: 'ON_GOING',
    name: 'Tài xế chấp nhận đơn',
  },
  {
    status: 'PICKED_UP',
    name: 'Tài xế đã lấy hàng',
  },
  {
    status: 'COMPLETED',
    name: 'Đã giao hàng',
  },
  {
    status: 'CANCELED',
    name: 'Người dùng hủy đơn',
  },
  {
    status: 'REJECTED',
    name: 'Tài xế từ chối đơn 2 lần',
  },
  {
    status: 'EXPIRED',
    name: 'Đơn hàng đã hết hạn vì không có tài xế nhận',
  },
  {
    status: 'PENDING',
    name: 'Tài xế chưa hoàn thành đơn',
  },
  {
    status: 'DELIVERED',
    name: 'Đơn hàng đã được giao và đã chụp ảnh',
  },
  {
    status: 'SIGNED',
    name: 'Đơn hàng đã được ký nhận',
  },
  {
    status: 'FAILED',
    name: 'Tài xế không thể hoàn thành việc giao hàng',
  },
];
