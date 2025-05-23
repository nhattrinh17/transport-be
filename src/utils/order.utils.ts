import { OrderUnitConstant } from '@common/constants';
import { PaymentMethodOrder } from '@common/enums';

export function generateOrderCode(type: string): string {
  const prefix = type.toUpperCase(); // Chuyển type thành chữ in hoa

  const now = new Date();

  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS

  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 ký tự ngẫu nhiên

  return `${prefix}${datePart}-${timePart}-${randomPart}`;
}

export function formatPhoneWithCountryCode(phone: string, countryCode = '+84'): string {
  let normalized = phone.trim();

  // Nếu bắt đầu bằng "0" thì thay bằng mã vùng
  if (normalized.startsWith('0')) {
    return countryCode + normalized.slice(1);
  }

  // Nếu đã có mã vùng rồi (bắt đầu bằng + hoặc 84), trả nguyên
  if (normalized.startsWith('+') || normalized.startsWith(countryCode.replace('+', ''))) {
    return normalized;
  }

  // Trường hợp không rõ ràng, cứ thêm mã vùng vào đầu
  return countryCode + normalized;
}

export function handleGetPaymentMethod(unit: string, paymentMethod: PaymentMethodOrder) {
  switch (unit) {
    case OrderUnitConstant.SUPERSHIP:
      if (paymentMethod == PaymentMethodOrder.SENDER) return '1';
      else return '2';
    case OrderUnitConstant.VIETTEL:
      switch (paymentMethod) {
        case PaymentMethodOrder.SENDER:
          return 1;
        case PaymentMethodOrder.RECEIVER_PAY_ALL:
          return 2;
        case PaymentMethodOrder.RECEIVER_PAY_PRODUCT:
          return 3;
        case PaymentMethodOrder.RECEIVER_PAY_FEE:
          return 4;
        default:
          return 0;
      }

    case OrderUnitConstant.GHN:
      if (paymentMethod == PaymentMethodOrder.SENDER) return 1;
      return 2;
    case OrderUnitConstant.NT:
      if (paymentMethod == PaymentMethodOrder.SENDER) return 10;
      return 20;
    default:
      break;
  }
}
