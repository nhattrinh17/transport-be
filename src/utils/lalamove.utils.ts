import HmacSHA256 from 'crypto-js/hmac-sha256';

export class LalamoveUtils {
  SECRET: string;
  API_KEY: string;
  constructor() {
    this.SECRET = process.env.SECRET_KEY_LALAMOVE || '';
    this.API_KEY = process.env.API_KEY_LALAMOVE || '';
  }

  generateSignature(path: string, method: string, dataBody?: any) {
    const time = new Date().getTime().toString();
    const body = JSON.stringify(dataBody || {});

    const rawSignature = dataBody ? `${time}\r\n${method}\r\n${path}\r\n\r\n${body}` : `${time}\r\n${method}\r\n${path}\r\n\r\n`;
    const signature = HmacSHA256(rawSignature, this.SECRET).toString();
    return {
      signature,
      token: `${this.API_KEY}:${time}:${signature}`,
    };
  }
}
