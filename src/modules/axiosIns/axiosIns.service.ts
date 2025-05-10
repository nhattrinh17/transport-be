import { messageResponseError } from '@common/constants';
import RedisService from '@common/services/redis.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { LalamoveUtils } from 'src/utils/lalamove.utils';

@Injectable()
export class AxiosInsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly lalamoveUtils: LalamoveUtils,
  ) {}

  async getTokenViettel(): Promise<string> {
    try {
      const keyRedis = `${process.env.APP_ID}:token:viettel`;
      const dataRedis = await this.redisService.get(keyRedis);
      if (dataRedis) return dataRedis;

      const res = await this.httpService.axiosRef.post(`${process.env.URL_BASE_VIETTEL}/v2/user/Login`, {
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

  async axiosInstanceGHN(shop_id?: string): Promise<AxiosInstance> {
    return axios.create({
      baseURL: process.env.URL_BASE_GHN,
      headers: {
        token: process.env.TOKEN_GHN,
        ShopId: shop_id,
      },
    });
  }

  async axiosInstanceGHTK(): Promise<AxiosInstance> {
    return axios.create({
      baseURL: process.env.URL_BASE_GHTK,
      headers: {
        Token: process.env.TOKEN_GHTK,
        'X-Client-Source': process.env.PARTNER_CODE,
      },
    });
  }

  async callApiLALAMOVE(method: string, path: string, dataBody?: any) {
    try {
      const dataSignature = this.lalamoveUtils.generateSignature(path, method, dataBody);
      const res = await this.httpService.axiosRef.request({
        method: method,
        url: `${process.env.URL_BASE_LALAMOVE}${path}`,
        data: dataBody,
        headers: {
          Authorization: `hmac ${dataSignature.token}`,
          Market: 'VN',
        },
      });

      return res.data;
    } catch (error) {
      console.log('🚀 ~ AxiosInsService ~ callApiLALAMOVE ~ error:', error?.response?.data);
      throw new Error(error.message);
    }
  }

  async axiosInstanceSuperShip(): Promise<AxiosInstance> {
    return axios.create({
      baseURL: process.env.URL_BASE_SUPERSHIP,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_SUPERSHIP}`,
      },
    });
  }

  async axiosInstanceNhatTin(): Promise<AxiosInstance> {
    return axios.create({
      baseURL: process.env.URL_BASE_NHATTIN,
    });
  }
}
