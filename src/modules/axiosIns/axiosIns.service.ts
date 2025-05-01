import { messageResponseError } from '@common/constants';
import RedisService from '@common/services/redis.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosInsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  async getTokenViettel(): Promise<string> {
    try {
      const keyRedis = `${process.env.APP_ID}:token:viettel`;
      const dataRedis = await this.redisService.get(keyRedis);
      if (dataRedis) return dataRedis;

      const res = await this.httpService.axiosRef.post(`${process.env.URL_BASE_VIETTEL}/user/Login`, {
        USERNAME: process.env.USERNAME_VIETTEL,
        PASSWORD: process.env.PASSWORD_VIETTEL,
      });

      if (res.data?.error) throw new Error(messageResponseError.token.get_token_viettel_error);

      const ttl = Math.floor((res.data.data?.expired - new Date().getTime()) / 1000 - 5);
      const token = res.data?.data?.token;
      await this.redisService.setExpire(keyRedis, token, ttl);

      return token;
    } catch (error) {
      throw new Error(messageResponseError.token.get_token_viettel_error);
    }
  }

  async axiosInstanceViettel(): Promise<AxiosInstance> {
    const tokenViettel = await this.getTokenViettel();
    return axios.create({
      baseURL: process.env.URL_BASE_VIETTEL,
      headers: {
        Token: tokenViettel,
      },
    });
  }

  async axiosInstanceGHN(): Promise<AxiosInstance> {
    return axios.create({
      baseURL: process.env.URL_BASE_GHN,
      headers: {
        token: process.env.TOKEN_GHN,
      },
    });
  }
}
