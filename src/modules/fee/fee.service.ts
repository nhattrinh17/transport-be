import RedisService from '@common/services/redis.service';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GetFeeDto, GetFeeServiceFastDto, GetServiceAvailableDto } from './dto/create-fee.dto';
import { ProvinceService } from '@modules/province/province.service';
import { send } from 'process';
import { ServiceNhatTin } from '@common/constants/nhattin.constant';
import { handleGetPaymentMethod } from 'src/utils';

@Injectable()
export class FeeService {
  constructor(
    private readonly axiosInsService: AxiosInsService,
    private readonly httpService: HttpService,
  ) {}

  async getServiceAvailable(dto: GetServiceAvailableDto) {
    try {
      const axiosInstanceViettel = await this.axiosInsService.axiosInstanceViettel();
      const axiosInstanceGHN = await this.axiosInsService.axiosInstanceGHN();
      const serviceViettel = (
        await axiosInstanceViettel.post(`/v2/order/getPriceAll`, {
          SENDER_PROVINCE: dto.senderProvince,
          SENDER_DISTRICT: dto.senderDistrict,
          RECEIVER_PROVINCE: dto.receiverProvince,
          RECEIVER_DISTRICT: dto.receiverDistrict,
          PRODUCT_TYPE: dto.productType,
          PRODUCT_WEIGHT: dto.weight,
          PRODUCT_PRICE: dto.value,
          MONEY_COLLECTION: dto.collection,
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
        viettel: serviceViettel?.filter((i) => i.MA_DV_CHINH != 'SHT' && i.MA_DV_CHINH != 'VHT'),
        ghn: serviceGHN?.data,
        nhattin: ServiceNhatTin.filter((i) => i.id != 81),
      };
    } catch (error) {
      console.log('🚀 ~ FeeService ~ getServiceAvailable ~ error:', error);
      throw new Error(error.message);
    }
  }

  async calculateFee(dto: GetFeeDto) {
    const dataViettel = {
      PRODUCT_WEIGHT: dto.weight,
      PRODUCT_PRICE: dto.value,
      MONEY_COLLECTION: dto.collection,
      ORDER_SERVICE_ADD: '',
      ORDER_SERVICE: dto.serviceCodeViettel,
      SENDER_PROVINCE: dto.senderProvince,
      SENDER_DISTRICT: dto.senderDistrict,
      RECEIVER_PROVINCE: dto.receiverProvince,
      RECEIVER_DISTRICT: dto.receiverDistrict,
      PRODUCT_TYPE: dto.productType,
      NATIONAL_TYPE: 1,
      PRODUCT_WIDTH: dto.width,
      PRODUCT_HEIGHT: dto.height,
      PRODUCT_LENGTH: dto.length,
    };
    const dataGHN = {
      service_type_id: dto.serviceTypeGHN,
      from_district_id: dto.senderDistrictGHN,
      from_ward_code: dto.senderWardCodeGHN,
      to_district_id: dto.receiverDistrictGHN,
      to_ward_code: dto.senderWardCodeGHN,
      length: dto.length,
      width: dto.width,
      height: dto.height,
      weight: dto.weight,
      insurance_value: dto.value,
      coupon: null,
      items: dto.items,
    };
    const dataLeadTime = {
      from_district_id: dto.senderDistrictGHN,
      from_ward_code: dto.senderWardCodeGHN,
      to_district_id: dto.receiverDistrictGHN,
      to_ward_code: dto.receiverWardCodeGHN,
      service_id: dto.serviceTypeGHN,
    };
    const dataGHTK = {
      pick_province: dto.senderProvinceStr,
      pick_district: dto.senderDistrictStr,
      pick_ward: dto.senderWardStr,
      province: dto.receiverProvinceStr,
      district: dto.receiverDistrictStr,
      ward: dto.receiverWardStr,
      weight: dto.weight,
      value: dto.value,
      deliver_option: 'none',
    };

    const dataNhatTin = {
      partner_id: Number(process.env.PARTNER_NHATTIN),
      weight: dto.weight / 1000,
      service_id: dto.serviceTypeNT,
      width: dto.width,
      length: dto.length,
      height: dto.height,
      payment_method_id: handleGetPaymentMethod('NT', dto.paymentMethod),
      cod_amount: dto.collection,
      cargo_value: dto.value,
      s_province: dto.senderProvinceStr,
      s_district: dto.senderDistrictStr,
      r_province: dto.receiverProvinceStr,
      r_district: dto.receiverDistrictStr,
    };

    const [feeViettel, feeGHN, leadTimeGHN, feeGHTK, resNhatTin] = await Promise.all([
      //
      (await this.axiosInsService.axiosInstanceViettel()).post(`/v2/order/getPrice`, dataViettel),
      (await this.axiosInsService.axiosInstanceGHN()).post(`/v2/shipping-order/fee`, dataGHN),
      (await this.axiosInsService.axiosInstanceGHN()).post(`/v2/shipping-order/leadtime`, dataLeadTime),
      (await this.axiosInsService.axiosInstanceGHTK()).get(`/services/shipment/fee`, { params: dataGHTK }),
      (await (await this.axiosInsService.axiosInstanceNhatTin()).post(`/v1/bill/calc-fee`, dataNhatTin)).data,
    ]);

    return {
      viettel: feeViettel.data?.data,
      ghn: {
        ...feeGHN.data?.data,
        leadTime: leadTimeGHN.data?.data,
      },
      ghtk: feeGHTK.data?.fee,
      nhattin: resNhatTin?.data[0],
    };
  }

  async getServiceFaster() {
    try {
      const serviceLalamove = (await this.axiosInsService.callApiLALAMOVE('GET', '/v3/cities'))?.data;
      return {
        lalamove: serviceLalamove,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async calculateFeeFaster(dto: GetFeeServiceFastDto) {
    const dataLALAMOVE: any = {
      serviceType: dto.serviceType,
      specialRequests: dto.specialRequestsLALA ?? [], // safe default
      language: dto.language,
      stops: dto.stops.map((item) => {
        return {
          coordinates: item.coordinates,
          address: item.address,
        };
      }),
      isRouteOptimized: Boolean(dto.isRouteOptimized),
      item: {
        quantity: dto.item.quantity,
        weight: dto.item.type,
        categories: dto.item.categories,
        handlingInstructions: dto.item.handlingInstructions,
      },
    };
    if (dto.scheduleAt) {
      dataLALAMOVE.scheduleAt = dto.scheduleAt;
    }
    console.log('🚀 ~ FeeService ~ calculateFeeFaster ~ dataLALAMOVE:', JSON.stringify(dataLALAMOVE));

    const dataSuperShip = {
      sender_province: dto.stops[0].province,
      sender_district: dto.stops[0].district,
      receiver_province: dto.stops[1].province,
      receiver_district: dto.stops[1].district,
      weight: dto.item.weigh,
      value: dto.item.price,
    };

    const dataViettel = {
      PRODUCT_WEIGHT: dto.item.weigh,
      PRODUCT_PRICE: dto.item.price,
      MONEY_COLLECTION: dto.item.collection,
      ORDER_SERVICE_ADD: '',
      ORDER_SERVICE: 'SHT',
      SENDER_PROVINCE: dto.stops[0].provinceId,
      SENDER_DISTRICT: dto.stops[0].districtId,
      RECEIVER_PROVINCE: dto.stops[1].provinceId,
      RECEIVER_DISTRICT: dto.stops[1].districtId,
      PRODUCT_TYPE: 'HH',
      NATIONAL_TYPE: 1,
    };

    const dataNhatTin = {
      partner_id: process.env.PARTNER_NHATTIN,
      weight: dto.item.weigh / 1000,
      service_id: 81,
      width: 0,
      length: 0,
      height: 0,
      payment_method_id: handleGetPaymentMethod('NT', dto.paymentMethod),
      cod_amount: dto.item.collection,
      cargo_value: dto.item.price,
      s_province: dto.stops[0].province,
      s_district: dto.stops[0].district,
      r_province: dto.stops[1].province,
      r_district: dto.stops[1].district,
    };

    const [resViettel, resLala, resSuperShip, resNhatTin] = await Promise.all([
      (await this.axiosInsService.axiosInstanceViettel()).post(`/v2/order/getPrice`, dataViettel),
      (await this.axiosInsService.callApiLALAMOVE('POST', '/v3/quotations', { data: dataLALAMOVE }))?.data,
      (
        await (
          await this.axiosInsService.axiosInstanceSuperShip()
        ).get('/v1/partner/orders/price', {
          params: dataSuperShip,
        })
      )?.data,
      (await (await this.axiosInsService.axiosInstanceNhatTin()).post(`/v1/bill/calc-fee`, dataNhatTin)).data,
    ]);

    return {
      lalamove: resLala,
      superShip: resSuperShip?.results[0],
      viettel: resViettel.data?.data,
      nhattin: resNhatTin?.data[0],
    };
  }
}
