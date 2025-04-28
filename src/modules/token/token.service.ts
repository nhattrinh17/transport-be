import { messageResponseError } from '@common/constants';
import RedisService from '@common/services/redis.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  async getTokenViettel() {
    const keyRedis = `${process.env.APP_ID}:token:viettel`;
    const dataRedis = await this.redisService.get(keyRedis);
    if (dataRedis) return dataRedis;
    const res = await this.httpService.axiosRef.post(`${process.env.URL_BASE_VIETTEL}/user/Login`, {
      USERNAME: process.env.USERNAME_VIETTEL,
      PASSWORD: process.env.PASSWORD_VIETTEL,
    });
    if (!res.data?.error) throw new Error(messageResponseError.token.get_token_viettel_error);
    const ttl = (res.data.data?.expired - new Date().getTime()) / 1000 - 5;
    this.redisService.setExpire(keyRedis, res.data?.data?.token, ttl);
    return res.data?.data?.token;
  }
}
