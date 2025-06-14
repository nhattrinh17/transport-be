import { Injectable } from '@nestjs/common';
import { CreateProvinceDto, GetDistrictDto, GetWardsDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import RedisService from '@common/services/redis.service';
import { messageResponseError } from '@common/constants';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';

@Injectable()
export class ProvinceService {
  constructor(
    private readonly redisService: RedisService,
    private readonly axiosInsService: AxiosInsService,
  ) {}

  async getAllProvince() {
    const keyViettel = `${process.env.APP_ID}:${process.env.APP_NAME}:province:viettel`;
    const keyGHN = `${process.env.APP_ID}:${process.env.APP_NAME}:province:ghn`;
    const ttl = 60 * 60 * 24;
    let providerViettel;
    let providerGHN;
    const [providerViettelRedis, providerGHNRedis] = await Promise.all([this.redisService.get(keyViettel), this.redisService.get(keyGHN)]);
    if (!providerViettelRedis) {
      providerViettel = (await (await this.axiosInsService.axiosInstanceViettel()).get(`/v2/categories/listProvinceById?provinceId=-1`)).data;
      this.redisService.setExpire(keyViettel, JSON.stringify(providerViettel), ttl);
    } else {
      providerViettel = JSON.parse(providerViettelRedis);
    }
    if (!providerGHNRedis) {
      providerGHN = (
        await (
          await this.axiosInsService.axiosInstanceGHN()
        ).get(`${process.env.URL_BASE_GHN}/master-data/province`, {
          headers: {
            TOKEN: process.env.TOKEN_GHN,
          },
        })
      ).data;
      this.redisService.setExpire(keyGHN, JSON.stringify(providerGHN), ttl);
    } else {
      providerGHN = JSON.parse(providerGHNRedis);
    }
    return {
      viettel: providerViettel?.data,
      ghn: providerGHN?.data?.map((i) => {
        return {
          ProvinceID: i.ProvinceID,
          ProvinceName: i.ProvinceName,
          NameExtension: i.NameExtension,
        };
      }),
    };
  }

  async getAllDistrict(dto: GetDistrictDto) {
    try {
      if (!dto.provinceIdGHN || !dto.provinceIdViettel) throw new Error(messageResponseError.system.missing_data);
      const keyViettel = `${process.env.APP_ID}:${process.env.APP_NAME}:district:viettel:${dto.provinceIdViettel}`;
      const keyGHN = `${process.env.APP_ID}:${process.env.APP_NAME}:district:ghn:${dto.provinceIdGHN}`;
      const ttl = 60 * 60;
      let districtViettel;
      let districtGHN;
      const [districtViettelRedis, districtGHNRedis] = await Promise.all([this.redisService.get(keyViettel), this.redisService.get(keyGHN)]);
      if (!districtViettelRedis) {
        districtViettel = (await (await this.axiosInsService.axiosInstanceViettel()).get(`/v2/categories/listDistrict?provinceId=${dto.provinceIdViettel}`)).data;
        this.redisService.setExpire(keyViettel, JSON.stringify(districtViettel), ttl);
      } else {
        districtViettel = JSON.parse(districtViettelRedis);
      }
      if (!districtGHNRedis) {
        districtGHN = (
          await (
            await this.axiosInsService.axiosInstanceGHN()
          ).get(`${process.env.URL_BASE_GHN}/master-data/district?province_id=${dto.provinceIdGHN}`, {
            headers: {
              TOKEN: process.env.TOKEN_GHN,
            },
          })
        ).data;
        this.redisService.setExpire(keyGHN, JSON.stringify(districtGHN), ttl);
      } else {
        districtGHN = JSON.parse(districtGHNRedis);
      }
      return {
        viettel: districtViettel?.data,
        ghn: districtGHN?.data?.map((i) => {
          return {
            DistrictID: i.DistrictID,
            ProvinceID: i.ProvinceID,
            DistrictName: i.DistrictName,
            Code: i.Code,
            NameExtension: i.NameExtension,
          };
        }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllWard(dto: GetWardsDto) {
    try {
      if (!dto.districtIdGHN || !dto.districtIdViettel) throw new Error(messageResponseError.system.missing_data);
      const keyViettel = `${process.env.APP_ID}:${process.env.APP_NAME}:wards:viettel:${dto.districtIdViettel}`;
      const keyGHN = `${process.env.APP_ID}:${process.env.APP_NAME}:wards:ghn:${dto.districtIdGHN}`;
      const ttl = 60 * 60;
      let wardsViettel;
      let wardsGHN;
      const [wardsViettelRedis, wardsGHNRedis] = await Promise.all([this.redisService.get(keyViettel), this.redisService.get(keyGHN)]);
      if (!wardsViettelRedis) {
        wardsViettel = (await (await this.axiosInsService.axiosInstanceViettel()).get(`/v2/categories/listWards?districtId=${dto.districtIdViettel}`)).data;
        this.redisService.setExpire(keyViettel, JSON.stringify(wardsViettel), ttl);
      } else {
        wardsViettel = JSON.parse(wardsViettelRedis);
      }
      if (!wardsGHNRedis) {
        wardsGHN = (
          await (
            await this.axiosInsService.axiosInstanceGHN()
          ).get(`${process.env.URL_BASE_GHN}/master-data/ward?district_id=${dto.districtIdGHN}`, {
            headers: {
              TOKEN: process.env.TOKEN_GHN,
            },
          })
        ).data;
        this.redisService.setExpire(keyGHN, JSON.stringify(wardsGHN), ttl);
      } else {
        wardsGHN = JSON.parse(wardsGHNRedis);
      }
      return {
        viettel: wardsViettel?.data,
        ghn: wardsGHN?.data?.map((i) => {
          return {
            WardCode: i.WardCode,
            DistrictID: i.DistrictID,
            WardName: i.WardName,
            NameExtension: i.NameExtension,
          };
        }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
