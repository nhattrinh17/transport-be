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
