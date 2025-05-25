export const ServiceNhatTin = [
  {
    name: 'Giao hàng nhanh (CPN)',
    id: 90,
  },
  {
    name: 'Hỏa tốc',
    id: 81,
  },
  {
    name: 'Tiết kiệm',
    id: 91,
  },
  {
    name: 'Hỗn hợp MES',
    id: 21,
  },
];

export const TypeProductNhatTin = [
  {
    name: 'Chứng từ',
    id: 1,
  },
  {
    name: 'Hàng hóa',
    id: 2,
  },
  {
    name: 'Hàng lạnh',
    id: 3,
  },
  {
    name: 'Xinh phẩm',
    id: 4,
  },
  {
    name: 'Mẫu bệnh phẩm',
    id: 5,
  },
];

export const StatusOrderNhatTin = [
  {
    id: 1,
    code: 'Waiting',
    name: 'Chưa thành công',
    statusSys: 'RECEIVED',
  },
  {
    id: 2,
    code: 'Waiting',
    name: 'Chờ lấy hàng',
    statusSys: 'WAITING_FOR_PICKUP',
  },
  {
    id: 3,
    code: 'KCB',
    name: 'Đã lấy hàng',
    statusSys: 'IN_STOCK',
  },
  {
    id: 4,
    code: 'FBC',
    name: 'Đã giao hàng',
    statusSys: 'SHIPPED',
  },
  {
    id: 6,
    code: 'GBV',
    name: 'Hủy',
    statusSys: 'CANCEL',
  },
  {
    id: 7,
    code: 'FUD',
    name: 'Không phát được',
    statusSys: 'FAILED',
  },
  {
    id: 9,
    code: 'NRT',
    name: 'Đang chuyển hoàn',
    statusSys: 'RETURN',
  },
  {
    id: 10,
    code: 'MRC',
    name: 'Đã chuyển hoàn',
    statusSys: 'RETURN',
  },
  {
    id: 11,
    code: 'QIU',
    name: 'Sự cố giao hàng',
    statusSys: 'FAILED',
  },
  {
    id: 12,
    code: 'DRF',
    name: 'Đợn vận nháp',
    statusSys: 'UNPROCESSED',
  },
  {
    id: 13,
    code: 'DEL',
    name: 'Đang giao hàng',
    statusSys: 'SHIPPING',
  },
  {
    id: 15,
    code: '',
    name: 'Đang vận chuyển',
    statusSys: 'RECEIVED',
  },
  {
    id: 16,
    code: '',
    name: 'Đang giao hàng hoàn',
    statusSys: 'RETURN',
  },
  {
    id: 17,
    code: '',
    name: 'Lỗi lấy hàng',
    statusSys: 'WAITING_FOR_PICKUP',
  },
];
