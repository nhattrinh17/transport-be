import RedisService from '@common/services/redis.service';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GetFeeDto, GetServiceAvailableDto } from './dto/create-fee.dto';

@Injectable()
export class FeeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly axiosInsService: AxiosInsService,
  ) {}

  async getServiceAvailable(dto: GetServiceAvailableDto) {
    try {
      const axiosInstanceViettel = await this.axiosInsService.axiosInstanceViettel();
      const axiosInstanceGHN = await this.axiosInsService.axiosInstanceGHN();
      const serviceViettel = (
        await axiosInstanceViettel.post(`/order/getPriceAll`, {
          SENDER_PROVINCE: dto.senderProvince,
          SENDER_DISTRICT: dto.senderDistrict,
          RECEIVER_PROVINCE: dto.receiverProvince,
          RECEIVER_DISTRICT: dto.receiverDistrict,
          PRODUCT_TYPE: dto.productType,
          PRODUCT_WEIGHT: dto.productWeight,
          PRODUCT_PRICE: dto.productPrice,
          MONEY_COLLECTION: dto.moneyCollection,
          TYPE: 1,
        })
      ).data;
      const serviceGHN = (
        await axiosInstanceGHN.post(`/v2/shipping-order/available-services`, {
          shop_id: +process.env.SHOP_ID_GHN,
          from_district: dto.senderDistrictGHN,
          to_district: dto.receiverDistrictGHN,
        })
      ).data;

      return {
        viettel: serviceViettel,
        ghn: serviceGHN?.data,
      };
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getServiceAvailable ~ error:', error);
      throw new Error(error.message);
    }
  }

  async calculateFee(dto: GetFeeDto) {
    const dataViettel = {
      PRODUCT_WEIGHT: dto.productWeight,
      PRODUCT_PRICE: dto.productPrice,
      MONEY_COLLECTION: dto.moneyCollection,
      ORDER_SERVICE_ADD: '',
      ORDER_SERVICE: dto.serviceCodeViettel,
      SENDER_PROVINCE: dto.senderProvince,
      SENDER_DISTRICT: dto.senderDistrict,
      RECEIVER_PROVINCE: dto.receiverProvince,
      RECEIVER_DISTRICT: dto.receiverDistrict,
      PRODUCT_TYPE: dto.productType,
      NATIONAL_TYPE: 1,
      PRODUCT_WIDTH: dto.productWith,
      PRODUCT_HEIGHT: dto.productHeight,
      PRODUCT_LENGTH: dto.productLength,
    };
    const dataGHN = {
      service_type_id: dto.serviceTypeGHN,
      from_district_id: dto.senderDistrictGHN,
      from_ward_code: dto.senderWardCodeGHN,
      to_district_id: dto.receiverDistrictGHN,
      to_ward_code: dto.senderWardCodeGHN,
      length: dto.productLength,
      width: dto.productWeight,
      height: dto.productHeight,
      weight: dto.productWeight,
      insurance_value: dto.productPrice,
      coupon: null,
      items: dto.items,
    };

    const [feeViettel, feeGHN] = await Promise.all([(await this.axiosInsService.axiosInstanceViettel()).post(`/order/getPrice`, dataViettel), (await this.axiosInsService.axiosInstanceGHN()).post(`/v2/shipping-order/fee`, dataGHN)]);

    return {
      viettel: feeViettel.data?.data,
      ghn: feeGHN.data?.data,
    };
  }
}
