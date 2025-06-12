import { createHash } from 'crypto';

export * from './logTelegram';
export * from './lalamove.utils';
export * from './order.utils';

export const convertToSlug = (text: string): string => {
  const baseSlug = text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const hash = createHash('sha256').update(text).digest('hex').slice(0, 8); // ổn định, ngắn gọn

  return `${baseSlug}-${hash}`;
};
