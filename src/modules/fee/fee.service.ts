import RedisService from '@common/services/redis.service';
import { TokenService } from '@modules/token/token.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeeService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
  ) {}

  async getServiceAvailable() {
    const tokenViettel = await this.tokenService.getTokenViettel();
    const keyViettel = `${process.env.APP_ID}:service:viettel`;
    const keyGHN = `${process.env.APP_ID}:service:ghn`;
    const ttl = 60 * 60 * 24;
    let serviceViettel;
    let serviceGHN;
    const [serviceViettelRedis, serviceGHNRedis] = await Promise.all([this.redisService.get(keyViettel), this.redisService.get(keyGHN)]);
    if (!serviceViettelRedis) {
      serviceViettel = (await this.httpService.axiosRef.get(`${process.env.URL_BASE_VIETTEL}/categories/listProvinceById?provinceId=-1`)).data;
      this.redisService.setExpire(keyViettel, JSON.stringify(serviceViettel), ttl);
    } else {
      serviceViettel = JSON.parse(serviceViettelRedis);
    }
    if (!serviceGHNRedis) {
      serviceGHN = (
        await this.httpService.axiosRef.get(`${process.env.URL_BASE_GHN}/master-data/province`, {
          headers: {
            TOKEN: process.env.TOKEN_GHN,
          },
        })
      ).data;
      this.redisService.setExpire(keyGHN, JSON.stringify(serviceGHN), ttl);
    } else {
      serviceGHN = JSON.parse(serviceGHNRedis);
    }
    return {
      viettel: serviceViettel?.data,
      ghn: serviceGHN?.data,
    };
  }
}
