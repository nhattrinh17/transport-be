import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetailRepositoryInterface, OrderRepositoryInterface } from 'src/database/interface';
import { OrderUnitConstant } from '@common/constants/order.constant';
import { ConfigReceiveOrder, PaymentMethodOrder } from '@common/enums';
import { formatPhoneWithCountryCode, generateOrderCode, handleGetPaymentMethod } from 'src/utils';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';
import { messageResponseError, statusSuperShip } from '@common/constants';
import moment from 'moment-timezone';
import { StatusOrderNhatTin } from '@common/constants/nhattin.constant';
import { StatusOrderLavaMove } from '@common/constants/lalamove.constant';
import { PaginationDto } from '@common/decorators';
import { OrderLogService } from '@modules/order-log/order-log.service';
import { QueryOrderDto, QueryOrderGetCountDto } from './dto/query-order.dto';
import { Between } from 'typeorm';
import { ProductService } from '@modules/product/product.service';
import RedisService from '@common/services/redis.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly axiosInsService: AxiosInsService,
    private readonly orderLogService: OrderLogService,
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
  ) {}

  handleGetConfigReceive(unit: string, configReceive: ConfigReceiveOrder) {
    switch (unit) {
      case OrderUnitConstant.SUPERSHIP:
        if (configReceive == ConfigReceiveOrder.SHOW) return '1';
        else if (configReceive == ConfigReceiveOrder.SHOW_AND_TRY) return '2';
        else return '3';
      case OrderUnitConstant.VIETTEL:
        switch (configReceive) {
          case ConfigReceiveOrder.SHOW:
            return 'Cho xem hàng, không thử hàng';
          case ConfigReceiveOrder.SHOW_AND_TRY:
            return 'Cho xem hàng, thử hàng';
          case ConfigReceiveOrder.NOT_SHOW:
            return 'Không cho xem hàng';
          default:
            throw new Error(messageResponseError.order.config_receive_order_not_supported);
        }
      case OrderUnitConstant.NT:
        return;
      case OrderUnitConstant.GHN:
        switch (configReceive) {
          case ConfigReceiveOrder.SHOW:
            return 'CHOXEMHANGKHONGTHU';
          case ConfigReceiveOrder.SHOW_AND_TRY:
            return 'CHOTHUHANG';
          case ConfigReceiveOrder.NOT_SHOW:
            return 'KHONGCHOXEMHANG';
          default:
            throw new Error(messageResponseError.order.config_receive_order_not_supported);
        }
      default:
        break;
    }
  }

  async handleCreateDataSuperShip(dto: CreateOrderDto) {
    const {
      unit,
      type,
      senderName,
      senderPhone,
      senderAddress,
      senderWard,
      senderDistrict,
      senderProvince,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverProvince,
      receiverDistrict,
      receiverWard,
      collection,
      value,
      weight,
      paymentMethod,
      configReceive,
      note,
      items,
    } = dto;
    if (dto.type == 'NORMAL') throw new Error(messageResponseError.order.ship_method_not_supported);
    const payer = handleGetPaymentMethod(unit, paymentMethod);
    const configReceiveOrder = this.handleGetConfigReceive(unit, configReceive);
    const data = {
      pickup_phone: senderPhone,
      pickup_address: senderAddress,
      pickup_province: senderProvince,
      pickup_district: senderDistrict,
      pickup_commune: senderWard,
      name: receiverName,
      phone: receiverPhone,
      address: receiverAddress,
      province: receiverProvince,
      district: receiverDistrict,
      commune: receiverWard,
      amount: collection,
      value: value,
      weight: weight,
      payer,
      service: '1',
      config: configReceiveOrder,
      soc: generateOrderCode(type),
      note: note,
      product_type: '2',
      senderName,
      products: items.map((item) => {
        return {
          sku: item.code,
          name: item.name,
          price: item.price,
          weight: item.weight,
          quantity: item.quantity,
        };
      }),
    };

    const resSuperShip = (await (await this.axiosInsService.axiosInstanceSuperShip()).post('/v1/partner/orders/add', data)).data;
    if (resSuperShip.status == 'Success') {
      const { code, sorting, shortcode, soc, fee, insurance, weight, status } = resSuperShip.results;
      return {
        order: {
          code,
          unit,
          type,
          sorting,
          shortcode,
          soc,
          configReceive,
          paymentMethod,
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: fee + insurance,
          statusText: statusSuperShip.find((item) => item.key == status)?.value || 'Chờ',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee, otherFee: insurance, surcharge: 0, collectionFee: 0, vat: 0, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(resSuperShip?.message || messageResponseError.order.create_order_supership_error);
    }
  }

  async handleCreateDataViettel(dto: CreateOrderDto) {
    const {
      unit,
      type,
      serviceId,
      senderName,
      senderPhone,
      senderAddress,
      senderWard,
      senderDistrict,
      senderProvince,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverProvince,
      receiverDistrict,
      receiverWard,
      collection,
      value,
      weight,
      length,
      width,
      height,
      note,
      paymentMethod,
      configReceive,
      items,
    } = dto;
    const orderCodeClient = generateOrderCode(type);
    const data = {
      ORDER_NUMBER: orderCodeClient,
      DELIVERY_DATE: moment(new Date()).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss'),
      SENDER_FULLNAME: senderName,
      SENDER_ADDRESS: senderAddress,
      SENDER_PHONE: senderPhone,
      SENDER_EMAIL: '',
      SENDER_WARD: Number(senderWard),
      SENDER_DISTRICT: Number(senderDistrict),
      SENDER_PROVINCE: Number(senderProvince),
      RECEIVER_FULLNAME: receiverName,
      RECEIVER_ADDRESS: receiverAddress,
      RECEIVER_PHONE: receiverPhone,
      RECEIVER_EMAIL: '',
      RECEIVER_WARD: Number(receiverWard),
      RECEIVER_DISTRICT: Number(receiverDistrict),
      RECEIVER_PROVINCE: Number(receiverProvince),
      PRODUCT_NAME: items?.length > 1 ? 'Nhiều sản phẩm' : items[0].name,
      PRODUCT_DESCRIPTION: items?.length > 1 ? 'Nhiều sản phẩm' : items[0].name,
      PRODUCT_QUANTITY: items.reduce((acc, item) => acc + item.quantity, 0),
      PRODUCT_PRICE: value,
      PRODUCT_WEIGHT: weight,
      PRODUCT_LENGTH: length,
      PRODUCT_WIDTH: width,
      PRODUCT_HEIGHT: height,
      PRODUCT_TYPE: 'HH',
      ORDER_PAYMENT: handleGetPaymentMethod(unit, paymentMethod),
      ORDER_SERVICE: serviceId,
      ORDER_SERVICE_ADD: '',
      ORDER_VOUCHER: '',
      ORDER_NOTE: `${this.handleGetConfigReceive(unit, configReceive)} - ${note}`,
      MONEY_COLLECTION: collection,
      MONEY_TOTAL_FEE: 0,
      MONEY_FEECOD: 0,
      MONEY_FEEVAS: 0,
      MONEY_FEEINSURRANCE: 0,
      MONEY_FEE: 0,
      MONEY_FEEOTHER: 0,
      MONEY_TOTALVAT: 0,
      MONEY_TOTAL: 0,
      LIST_ITEM: items.map((item) => {
        return { PRODUCT_NAME: item.name, PRODUCT_PRICE: item.price, PRODUCT_WEIGHT: item.weight, PRODUCT_QUANTITY: item.quantity };
      }),
    };
    const resViettel = (await (await this.axiosInsService.axiosInstanceViettel()).post('/v2/order/createOrder', data)).data;
    if (!resViettel.error) {
      const { ORDER_NUMBER, MONEY_OTHER_FEE, MONEY_TOTAL_FEE, MONEY_FEE, MONEY_COLLECTION_FEE, MONEY_FEE_VAT, EXCHANGE_WEIGHT, MONEY_TOTAL } = resViettel.data;
      return {
        order: {
          code: ORDER_NUMBER,
          unit,
          type,
          sorting: '',
          shortcode: '',
          soc: orderCodeClient,
          configReceive,
          paymentMethod,
          senderName,
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: MONEY_TOTAL,
          statusText: 'Chờ lấy hàng',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight: EXCHANGE_WEIGHT, mainFee: MONEY_TOTAL_FEE, otherFee: MONEY_OTHER_FEE, surcharge: MONEY_FEE, collectionFee: MONEY_COLLECTION_FEE, vat: MONEY_FEE_VAT, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_viettel_error);
    }
  }

  async handleCreateDataGHN(dto: CreateOrderDto) {
    const {
      unit,
      type,
      senderName,
      senderPhone,
      senderAddress,
      senderWard,
      senderDistrict,
      senderProvince,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverProvince,
      receiverDistrict,
      receiverWard,
      collection,
      value,
      weight,
      length,
      width,
      height,
      note,
      serviceId,
      paymentMethod,
      configReceive,
      items,
    } = dto;
    if (type != 'NORMAL') throw new Error(messageResponseError.order.ship_method_not_supported);
    const orderCodeClient = generateOrderCode(type);
    const data = {
      payment_type_id: handleGetPaymentMethod(unit, paymentMethod),
      note: note,
      required_note: this.handleGetConfigReceive(unit, configReceive),
      client_order_code: orderCodeClient,
      from_name: senderName,
      from_phone: senderPhone,
      from_address: senderAddress,
      from_ward_name: senderWard,
      from_district_name: senderDistrict,
      from_province_name: senderProvince,
      to_name: receiverName,
      to_phone: receiverPhone,
      to_address: receiverAddress,
      to_ward_name: receiverWard,
      to_district_name: receiverDistrict,
      to_province_name: receiverProvince,
      cod_amount: collection,
      content: note,
      length: length,
      width: width,
      height: height,
      weight: weight,
      cod_failed_amount: 0,
      // "pick_station_id": 1444,
      insurance_value: value,
      service_type_id: serviceId,
      // service_type_id: items.reduce((acc, item) => acc + item.weight, 0) > 20000 ? 5 : 2,
      coupon: null,
      items: items,
    };

    try {
      const resGHN = (await (await this.axiosInsService.axiosInstanceGHN()).post('/v2/shipping-order/create', data)).data;
      if (resGHN.message == 'Success') {
        const { sort_code, order_code, fee, total_fee, expected_delivery_time } = resGHN.data;
        return {
          order: {
            code: order_code,
            unit,
            type: type,
            sorting: '',
            shortcode: sort_code,
            soc: orderCodeClient,
            configReceive,
            paymentMethod,
            senderName,
            senderAddress,
            senderPhone,
            name: receiverName,
            address: receiverAddress,
            phone: receiverPhone,
            collection,
            value,
            totalFee: total_fee,
            statusText: 'Chờ lấy hàng',
            estimatedDeliveryTime: expected_delivery_time,
          },
          detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee?.main_service, otherFee: fee?.station_do + fee?.station_pu, surcharge: 0, collectionFee: 0, vat: 0, r2sFee: fee?.r2s, returnFee: fee?.return },
        };
      } else {
        throw new Error(resGHN?.code_message || messageResponseError.order.create_order_ghn_error);
      }
    } catch (error) {
      throw new Error(error?.message || messageResponseError.order.create_order_ghn_error);
    }
  }

  async handleCreateDataGHTK(dto: CreateOrderDto) {
    const {
      unit,
      type,
      senderName,
      senderPhone,
      senderAddress,
      senderWard,
      senderDistrict,
      senderProvince,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverProvince,
      receiverDistrict,
      receiverWard,
      collection,
      value,
      weight,
      note,
      paymentMethod,
      configReceive,
      items,
    } = dto;
    if (type != 'NORMAL') throw new Error(messageResponseError.order.ship_method_not_supported);
    const orderCodeClient = generateOrderCode(type);
    const data = {
      order: {
        id: orderCodeClient,
        pick_name: senderName,
        pick_address: senderAddress,
        pick_province: senderProvince,
        pick_district: senderDistrict,
        pick_ward: senderWard,
        pick_tel: senderPhone,
        tel: receiverPhone,
        name: receiverName,
        address: receiverAddress,
        province: receiverProvince,
        district: receiverDistrict,
        ward: receiverWard,
        hamlet: 'Khác',
        is_freeship: handleGetPaymentMethod(unit, paymentMethod),
        pick_money: collection,
        note: note,
        value: value,
        pick_option: 'cod',
      },
      products: items.map((item) => {
        return {
          name: item.name,
          weight: item.weight / 1000,
          quantity: item.quantity,
          product_code: item.code,
        };
      }),
    };

    try {
      const resGHTK = (await (await this.axiosInsService.axiosInstanceGHTK()).post('/services/shipment/order', data)).data;
      if (resGHTK.success) {
        const { tracking_id, fee, insurance_fee, estimated_deliver_time } = resGHTK.order;
        return {
          order: {
            code: tracking_id,
            unit,
            type,
            sorting: '',
            shortcode: '',
            soc: orderCodeClient,
            configReceive,
            paymentMethod,
            senderName,
            senderAddress,
            senderPhone,
            name: receiverName,
            address: receiverAddress,
            phone: receiverPhone,
            collection,
            value,
            totalFee: fee + insurance_fee,
            statusText: 'Đã tiếp nhận',
            estimatedDeliveryTime:
              estimated_deliver_time?.split('')[0] == 'Chiều'
                ? moment(estimated_deliver_time?.split('')[1]).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY 9:00:00')
                : moment(estimated_deliver_time?.split('')[1]).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY 14:00:00'),
          },
          detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee, otherFee: 0, surcharge: insurance_fee, collectionFee: 0, vat: 0, r2sFee: 0, returnFee: 0 },
        };
      } else {
        throw new Error(messageResponseError.order.create_order_ghtk_error);
      }
    } catch (error) {
      throw new Error(error?.response?.data?.code_message || messageResponseError.order.create_order_ghtk_error);
    }
  }

  async handleCreateDataNhatTin(dto: CreateOrderDto) {
    const {
      unit,
      type,
      serviceId,
      senderName,
      senderPhone,
      senderAddress,
      senderWard,
      senderDistrict,
      senderProvince,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverProvince,
      receiverDistrict,
      receiverWard,
      collection,
      value,
      weight,
      length,
      width,
      height,
      note,
      paymentMethod,
      configReceive,
    } = dto;
    const orderCodeClient = generateOrderCode(type);
    const data = {
      partner_id: process.env.PARTNER_NHATTIN,
      ref_code: orderCodeClient,
      weight: weight / 1000,
      width,
      length,
      height,
      service_id: Number(serviceId),
      payment_method_id: handleGetPaymentMethod(unit, paymentMethod),
      cod_amount: collection,
      cargo_value: value,
      cargo_type_id: 2,
      s_name: senderName,
      s_phone: senderPhone,
      s_address: senderAddress,
      s_ward_name: senderWard,
      s_district_name: senderDistrict,
      s_province_name: senderProvince,
      r_name: receiverName,
      r_phone: receiverPhone,
      r_address: receiverAddress,
      r_ward_name: receiverWard,
      r_district_name: receiverDistrict,
      r_province_name: receiverProvince,
      note: note,
    };

    const resNhatTin = (await (await this.axiosInsService.axiosInstanceNhatTin()).post('/v2/bill/create', data)).data;
    if (resNhatTin.success) {
      const { bill_id, bill_code, total_fee, main_fee, expected_at, cod_fee, insurr_fee, lifting_fee, remote_fee, counting_fee, packing_fee, status_id } = resNhatTin.data;
      return {
        order: {
          code: bill_code,
          unit,
          type,
          sorting: '',
          shortcode: bill_id,
          soc: orderCodeClient,
          configReceive,
          paymentMethod,
          senderName,
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: total_fee,
          statusText: StatusOrderNhatTin.find((item) => item.id == status_id)?.name,
          estimatedDeliveryTime: expected_at,
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: main_fee, otherFee: insurr_fee + lifting_fee + counting_fee + packing_fee, surcharge: remote_fee, collectionFee: cod_fee, vat: 0, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_ghn_error);
    }
  }

  async handleCreateDataLalamove(dto: CreateOrderDto) {
    const { quotationId, senderName, senderPhone, senderAddress, receiverAddress, receiverName, receiverPhone, unit, type } = dto;
    if (type != 'HT') throw new Error(messageResponseError.order.ship_method_not_supported);
    const orderCodeClient = generateOrderCode(type);
    if (!quotationId) throw new Error(messageResponseError.order.missing_quotation_id);
    const data = {
      data: {
        quotationId: quotationId,
        sender: {
          stopId: senderAddress,
          name: senderName,
          phone: formatPhoneWithCountryCode(senderPhone),
        },
        recipients: [
          {
            stopId: receiverAddress,
            name: receiverName,
            phone: formatPhoneWithCountryCode(receiverPhone),
          },
        ],
        isPODEnabled: true,
      },
    };

    const resLala = await this.axiosInsService.callApiLALAMOVE('POST', '/v3/orders', data);
    if (resLala.data) {
      const { orderId, shareLink, priceBreakdown, status } = resLala.data;
      return {
        order: {
          code: orderId,
          unit,
          type,
          sorting: '',
          shortcode: '',
          soc: orderCodeClient,
          configReceive: '',
          paymentMethod: '',
          senderName,
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          totalFee: +priceBreakdown?.total,
          statusText: StatusOrderLavaMove.find((item) => item.status == status)?.name,
        },
        detail: {
          note: '',
          isPODEnabled: true,
          shareLink,
          mainFee: priceBreakdown?.base,
          otherFee: (+priceBreakdown?.extraMileage || 0) + (+priceBreakdown?.priorityFee || 0),
          surcharge: priceBreakdown?.surcharge,
          collectionFee: 0,
          vat: 0,
          r2sFee: 0,
          returnFee: 0,
        },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_lalamove_error);
    }
  }

  async create(dto: CreateOrderDto) {
    try {
      const { unit } = dto;
      let dataOrder;
      switch (unit) {
        case OrderUnitConstant.VIETTEL:
          dataOrder = await this.handleCreateDataViettel(dto);
          break;
        case OrderUnitConstant.GHN:
          dataOrder = await this.handleCreateDataGHN(dto);
          break;
        case OrderUnitConstant.GHTK:
          dataOrder = await this.handleCreateDataGHTK(dto);
          break;
        case OrderUnitConstant.NT:
          dataOrder = await this.handleCreateDataNhatTin(dto);
          break;
        case OrderUnitConstant.LALAMOVE:
          dataOrder = await this.handleCreateDataLalamove(dto);
          break;
        case OrderUnitConstant.SUPERSHIP:
          dataOrder = await this.handleCreateDataSuperShip(dto);
          break;
        default:
          throw new Error(messageResponseError.order.unit_not_supported);
      }
      const order = await this.orderRepository.create(dataOrder.order);
      const orderDetail = await this.orderDetailRepository.create({
        ...dataOrder.detail,
        orderId: order.id,
      });
      this.productService.handleCreateOrderProduct(dto.items, order.id, dto.warehouseId);
      return {
        message: 'Tạo đơn hàng thành công',
        code: order.code,
      };
    } catch (error) {
      console.log('🚀 ~ OrderService ~ create ~ error:', error);
      throw new Error(error.message);
    }
  }

  async printOrder(id: string, size: string, original: string) {
    try {
      let urlPrint = '';
      const order = await this.orderRepository.findOneById(id, ['unit', 'code', 'id']);
      if (!order) throw new Error(messageResponseError.order.order_not_found);
      switch (order.unit) {
        case OrderUnitConstant.VIETTEL:
          const resViettel = (
            await (
              await this.axiosInsService.axiosInstanceViettel()
            ).post('/v2/order/encryptLinkPrint', {
              TYPE: 1,
              ORDER_ARRAY: [order.code],
              EXPIRY_TIME: new Date().getTime() + 86400000,
              PRINT_TOKEN: 'Token in do Viettelpost Cấp',
            })
          ).data;
          if (resViettel.error) throw new Error(messageResponseError.order.cannot_print_order);
          urlPrint = resViettel.data;
          break;
        case OrderUnitConstant.GHN:
          const resToken = (
            await (
              await this.axiosInsService.axiosInstanceGHN()
            ).post('/v2/a5/gen-token', {
              order_codes: [order.code],
            })
          ).data;
          urlPrint = `https://online-gateway.ghn.vn/a5/public-api/print${size || 'A5'}?token=${resToken?.data?.token}`;
          break;
        case OrderUnitConstant.GHTK:
          const resGHTK = (await (await this.axiosInsService.axiosInstanceGHTK()).get(`/services/label/${order.code}?original=${original || 'portrait'}&paper_size=${size || 'A6'}`)).data;
          return {
            data: resGHTK?.data,
          };
        case OrderUnitConstant.NT:
          urlPrint = `${process.env.URL_BASE_PRINT_NHATTIN}/v1/bill/print?do_code=${order.code}&partner_id=${process.env.PARTNER_NHATTIN}`;
          break;
        case OrderUnitConstant.SUPERSHIP:
          const resSuperShip = (await (await this.axiosInsService.axiosInstanceSuperShip()).post('/v1/partner/orders/token', { code: [order.code] })).data;
          if (resSuperShip.status == 'Success') {
            urlPrint = `${process.env.URL_BASE_PRINT_SUPERSHIP}?token=${resSuperShip.results?.token}&size=${size || 'A5'}`;
            break;
          } else {
            throw new Error(messageResponseError.order.cannot_print_order);
          }
      }
      if (!urlPrint) throw new Error(messageResponseError.order.cannot_print_order);
      this.orderDetailRepository.findOneAndUpdate(
        {
          orderId: id,
        },
        {
          isPinter: true,
        },
      );
      return {
        data: urlPrint,
      };
    } catch (error) {
      throw new Error(messageResponseError.order.cannot_print_order);
    }
  }

  findCountOrderByStatus(filterDto: QueryOrderGetCountDto) {
    const { startDate, endDate, unit } = filterDto;
    const filter = {};
    if (unit) {
      filter['unit'] = unit;
    }
    if (startDate && endDate) {
      filter['createdAt'] = Between(new Date(startDate), new Date(endDate));
    }
    // console.log('🚀 ~ OrderService ~ findCountOrderByStatus ~ filter:', filter);

    return this.orderRepository.findCountOrderByStatus(filter);
  }

  findAllOrder(pagination: PaginationDto, dto: QueryOrderDto) {
    const filter = {};
    const { startDate, endDate, status, unit, paymentMethod, isPinter, configReceive } = dto;
    if (status) {
      filter['status'] = status;
    }
    if (unit) {
      filter['unit'] = unit;
    }
    if (paymentMethod) {
      filter['paymentMethod'] = paymentMethod;
    }
    if (isPinter) {
      filter['isPinter'] = isPinter;
    }
    if (configReceive) {
      filter['configReceive'] = configReceive;
    }
    if (startDate && endDate) {
      filter['createdAt'] = Between(new Date(startDate), new Date(endDate));
    }
    return this.orderRepository.findAll(filter, { ...pagination });
  }

  async findOne(id: string) {
    try {
      const keyCache = `${process.env.APP_ID}:${process.env.APP_NAME}:order:${id}`;
      const cacheOrder = await this.redisService.get(keyCache);
      if (cacheOrder) {
        return JSON.parse(cacheOrder);
      }
      const order = await this.orderRepository.findOneByIdAndJoin(id);
      await this.redisService.setExpire(keyCache, JSON.stringify(order), 60 * 60); // Cache for 1 hour
      if (!order) throw new Error(messageResponseError.order.order_not_found);
      return order;
    } catch (error) {
      console.log('🚀 ~ OrderService ~ findOne ~ error:', error);
    }
  }

  async cancel(id: string) {
    try {
      const order = await this.orderRepository.findOneById(id, ['unit', 'code', 'statusText', 'id']);
      if (!order) throw new Error(messageResponseError.order.order_not_found);
      let isRemove = false;
      switch (order.unit) {
        case OrderUnitConstant.VIETTEL:
          const removeOrderViettel = (
            await (
              await this.axiosInsService.axiosInstanceViettel()
            ).post('/v2/order/UpdateOrder', {
              TYPE: 4,
              ORDER_NUMBER: order.code,
              NOTE: 'Hủy đơn hàng',
            })
          ).data;
          if (!removeOrderViettel.error) {
            // cancel order in viettel post
            (await this.axiosInsService.axiosInstanceViettel()).post('/v2/order/UpdateOrder', {
              TYPE: 11,
              ORDER_NUMBER: order.code,
              NOTE: 'Xóa đơn hàng',
            });
            // cancel order in database
            isRemove = true;
          }
          break;
        case OrderUnitConstant.GHN:
          const removeOrderGHN = (await (await this.axiosInsService.axiosInstanceGHN()).post('/v2/switch-status/cancel', { order_code: ['5E3NK3RS'] })).data;
          if (removeOrderGHN.message == 'Success') {
            isRemove = true;
          }
          break;
        case OrderUnitConstant.GHTK:
          const removeOrder = (await (await this.axiosInsService.axiosInstanceGHTK()).post(`/services/shipment/cancel/${order.code}`)).data;
          if (removeOrder.success) {
            isRemove = true;
          } else {
            throw new Error(messageResponseError.order.cancel_order_ghtk_error);
          }
          break;
        case OrderUnitConstant.NT:
          const removeOrderNhatTin = (await (await this.axiosInsService.axiosInstanceNhatTin()).post('v1/bill/destroy', { bill_code: [order.code] })).data;
          if (removeOrderNhatTin.success) {
            isRemove = true;
          }
          break;
        case OrderUnitConstant.LALAMOVE:
          try {
            const removeOrderLalamove = (await this.axiosInsService.callApiLALAMOVE('DELETE', `/v3/orders/${order.code}`)).data;
            console.log('🚀 ~ OrderService ~ cancel ~ /v3/orders/${order.code}:', `/v3/orders/${order.code}`);
            isRemove = true;
          } catch (error) {
            throw new Error(messageResponseError.order.cancel_order_lalamove_error);
          }
          break;
        case OrderUnitConstant.SUPERSHIP:
          const removeOrderSuperShip = (await (await this.axiosInsService.axiosInstanceSuperShip()).post('/v1/partner/orders/cancel', { code: order.code })).data;
          if (removeOrderSuperShip.status == 'Success') {
            isRemove = true;
          } else {
            throw new Error(removeOrderSuperShip?.errors?.message || messageResponseError.order.cancel_order_supership_error);
          }
          break;
        default:
          break;
      }
      if (isRemove) {
        await Promise.all([
          this.orderRepository.findByIdAndUpdate(id, {
            status: 'CANCEL',
            statusText: 'Đã hủy đơn hàng',
          }),
          this.orderLogService.createOrderLog({
            orderId: id,
            statusPrevious: order.statusText,
            statusCurrent: 'Đã hủy đơn hàng',
            typeUpdate: 'status',
            changeBy: 'Người dùng',
          }),
        ]);
        this.productService.handleCancelOrder(order.id);
        return { message: 'Hủy đơn hàng thành công' };
      } else {
        throw new Error(messageResponseError.order.cancel_order_error);
      }
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message || messageResponseError.order.cancel_order_error);
    }
  }
}
