export const StatusOrderLavaMove = [
  {
    status: 'ASSIGNING_DRIVER',
    name: 'Đang tìm tài xế',
    statusSys: 'RECEIVED',
  },
  {
    status: 'ON_GOING',
    name: 'Tài xế chấp nhận đơn',
    statusSys: 'WAITING_FOR_PICKUP',
  },
  {
    status: 'PICKED_UP',
    name: 'Tài xế đã lấy hàng',
    statusSys: 'SHIPPING',
  },
  {
    status: 'COMPLETED',
    name: 'Đã giao hàng',
    statusSys: 'SHIPPED',
  },
  {
    status: 'CANCELED',
    name: 'Người dùng hủy đơn',
    statusSys: 'CANCEL',
  },
  {
    status: 'REJECTED',
    name: 'Tài xế từ chối đơn 2 lần',
    statusSys: 'CANCEL',
  },
  {
    status: 'EXPIRED',
    name: 'Đơn hàng đã hết hạn vì không có tài xế nhận',
    statusSys: 'CANCEL',
  },
  {
    status: 'PENDING',
    name: 'Tài xế chưa hoàn thành đơn',
    statusSys: 'SHIPPING',
  },
  {
    status: 'DELIVERED',
    name: 'Đơn hàng đã được giao và đã chụp ảnh',
    statusSys: 'SHIPPED',
  },
  {
    status: 'SIGNED',
    name: 'Đơn hàng đã được ký nhận',
    statusSys: 'SHIPPED',
  },
  {
    status: 'FAILED',
    name: 'Tài xế không thể hoàn thành việc giao hàng',
    statusSys: 'FAILED',
  },
];
