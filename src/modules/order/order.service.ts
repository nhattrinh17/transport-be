import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetailRepositoryInterface, OrderRepositoryInterface } from 'src/database/interface';
import { OrderUnitConstant } from '@common/constants/order.constant';
import { ConfigReceiveOrder, PaymentMethodOrder } from '@common/enums';
import { formatPhoneWithCountryCode, generateOrderCode } from 'src/utils';
import { AxiosInsService } from '@modules/axiosIns/axiosIns.service';
import { messageResponseError } from '@common/constants';
import moment from 'moment-timezone';
import { StatusOrderNhatTin } from '@common/constants/nhattin.constant';
import { StatusOrderLavaMove } from '@common/constants/lalamove.constant';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly axiosInsService: AxiosInsService,
  ) {}

  handleGetPaymentMethod(unit: string, paymentMethod: PaymentMethodOrder) {
    switch (unit) {
      case OrderUnitConstant.SUPERSHIP:
        if (paymentMethod == PaymentMethodOrder.SENDER) return '1';
        else return '2';
      case OrderUnitConstant.VIETTEL:
        switch (paymentMethod) {
          case PaymentMethodOrder.SENDER:
            return 1;
          case PaymentMethodOrder.RECEIVER_PAY_ALL:
            return 2;
          case PaymentMethodOrder.RECEIVER_PAY_PRODUCT:
            return 3;
          case PaymentMethodOrder.RECEIVER_PAY_FEE:
            return 4;
          default:
            break;
        }

      case OrderUnitConstant.GHN:
        if (paymentMethod == PaymentMethodOrder.SENDER) return 1;
        return 2;
      case OrderUnitConstant.NT:
        if (paymentMethod == PaymentMethodOrder.SENDER) return 10;
        return 20;
      default:
        break;
    }
  }

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
            break;
        }
        return;
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
            break;
        }
      default:
        break;
    }
  }

  async handleCreateDataSuperShip(dto: CreateOrderDto) {
    const {
      unit,
      type,
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
      products,
    } = dto;
    const payer = this.handleGetPaymentMethod(unit, paymentMethod);
    const configReceiveOrder = this.handleGetConfigReceive(unit, configReceive);
    const data = {
      pickup_phone: senderPhone,
      pickup_address: senderAddress,
      pickup_commune: senderWard,
      pickup_district: senderDistrict,
      pickup_province: senderProvince,
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
      service: 1,
      config: configReceiveOrder,
      soc: generateOrderCode(type),
      note: note,
      product_type: '2',
      products: products,
    };

    const resSuperShip = (await (await this.axiosInsService.axiosInstanceSuperShip()).post('/v1/partner/orders/add', data)).data;
    if (resSuperShip.status == 'Success') {
      const { code, sorting, shortcode, soc, fee, insurance, weight } = resSuperShip.results;
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
          status: 'Chờ lấy hàng',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee, otherFee: insurance, surcharge: 0, collectionFee: 0, vat: 0, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_supership_error);
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
      products,
    } = dto;

    const orderCodeClient = generateOrderCode(type);
    const data = {
      ORDER_NUMBER: orderCodeClient,
      GROUPADDRESS_ID: '',
      CUS_ID: '',
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
      PRODUCT_NAME: products?.length > 1 ? 'Nhiều sản phẩm' : products[0].name,
      PRODUCT_DESCRIPTION: products?.length > 1 ? 'Nhiều sản phẩm' : products[0].name,
      PRODUCT_QUANTITY: products.reduce((acc, item) => acc + item.quantity, 0),
      PRODUCT_PRICE: value,
      PRODUCT_WEIGHT: weight,
      PRODUCT_LENGTH: length,
      PRODUCT_WIDTH: width,
      PRODUCT_HEIGHT: height,
      PRODUCT_TYPE: 'HH',
      ORDER_PAYMENT: this.handleGetPaymentMethod(unit, paymentMethod),
      ORDER_SERVICE: serviceId,
      ORDER_SERVICE_ADD: '',
      ORDER_VOUCHER: '',
      ORDER_NOTE: `${this.handleGetConfigReceive(unit, configReceive)} - ${note}`,
      MONEY_COLLECTION: collection,
      MONEY_TOTALFEE: 0,
      MONEY_FEECOD: 0,
      MONEY_FEEVAS: 0,
      MONEY_FEEINSURRANCE: 0,
      MONEY_FEE: 0,
      MONEY_FEEOTHER: 0,
      MONEY_TOTALVAT: 0,
      MONEY_TOTAL: 0,
      LIST_ITEM: products.map((item) => {
        return { PRODUCT_NAME: item.name, PRODUCT_PRICE: item.price, PRODUCT_WEIGHT: item.weight, PRODUCT_QUANTITY: item.quantity };
      }),
    };
    console.log('🚀 ~ OrderService ~ handleCreateDataViettel ~ data:', JSON.stringify(data));
    const resViettel = (await (await this.axiosInsService.axiosInstanceViettel()).post('/v2/order/createOrder', data)).data;
    console.log('🚀 ~ OrderService ~ handleCreateDataViettel ~ resViettel:', resViettel);
    if (!resViettel.error) {
      const { ORDER_NUMBER, MONEY_OTHER_FEE, MONEY_TOTALFEE, MONEY_FEE, MONEY_COLLECTION_FEE, MONEY_FEE_VAT, EXCHANGE_WEIGHT, MONEY_TOTAL } = resViettel.data;
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
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: MONEY_TOTAL,
          status: 'Chờ lấy hàng',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight: EXCHANGE_WEIGHT, mainFee: MONEY_TOTALFEE, otherFee: MONEY_OTHER_FEE, surcharge: MONEY_FEE, collectionFee: MONEY_COLLECTION_FEE, vat: MONEY_FEE_VAT, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_viettel_error);
    }
  }

  async handleCreateDataGHN(dto: CreateOrderDto) {
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
      products,
    } = dto;
    const orderCodeClient = generateOrderCode(type);
    const data = {
      payment_type_id: this.handleGetPaymentMethod(unit, paymentMethod),
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
      service_type_id: +serviceId,
      coupon: null,
      items: products,
    };

    const resGHN = (await (await this.axiosInsService.axiosInstanceGHN()).post('/v2/shipping-order/create', data)).data;
    if (resGHN.message == 'OK') {
      const { sort_code, order_code, fee, total_fee } = resGHN.data;
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
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: total_fee,
          status: 'Chờ lấy hàng',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee?.main_service, otherFee: fee?.station_do + fee?.station_pu, surcharge: 0, collectionFee: 0, vat: 0, r2sFee: fee?.r2s, returnFee: fee?.return },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_ghn_error);
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
      products,
    } = dto;
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
        is_freeship: this.handleGetPaymentMethod(unit, paymentMethod),
        pick_money: collection,
        note: note,
        value: value,
        pick_option: 'cod',
      },
      products: products.map((item) => {
        return {
          name: item.name,
          weight: item.weight / 1000,
          quantity: item.quantity,
          product_code: item.code,
        };
      }),
    };

    const resGHTK = (await (await this.axiosInsService.axiosInstanceGHTK()).post('/services/shipment/order', data)).data;
    if (resGHTK.success) {
      const { tracking_id, fee, insurance_fee } = resGHTK.order;
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
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: fee + insurance_fee,
          status: 'Đã tiếp nhận',
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: fee, otherFee: 0, surcharge: insurance_fee, collectionFee: 0, vat: 0, r2sFee: 0, returnFee: 0 },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_ghn_error);
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
      weight,
      width,
      length,
      height,
      service_id: serviceId,
      payment_method_id: this.handleGetPaymentMethod(unit, paymentMethod),
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
          code: bill_id,
          unit,
          type,
          sorting: '',
          shortcode: bill_code,
          soc: orderCodeClient,
          configReceive,
          paymentMethod,
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          collection,
          value,
          totalFee: total_fee,
          status: StatusOrderNhatTin.find((item) => item.id == status_id)?.name,
          estimatedDeliveryTime: expected_at,
        },
        detail: { note, isPODEnabled: false, shareLink: '', weight, mainFee: main_fee, otherFee: insurr_fee + lifting_fee + counting_fee + packing_fee, surcharge: remote_fee, collectionFee: cod_fee, vat: 0, r2sFee: 0, returnFee: NaN },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_ghn_error);
    }
  }

  async handleCreateDataLalamove(dto: CreateOrderDto) {
    const { quotationId, senderName, senderPhone, senderAddress, receiverAddress, receiverName, receiverPhone, unit, type } = dto;
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
          senderAddress,
          senderPhone,
          name: receiverName,
          address: receiverAddress,
          phone: receiverPhone,
          totalFee: +priceBreakdown?.total,
          status: StatusOrderLavaMove.find((item) => item.status == status)?.name,
        },
        detail: {
          note: '',
          isPODEnabled: true,
          shareLink,
          mainFee: priceBreakdown?.base,
          otherFee: +priceBreakdown?.extraMileage + +priceBreakdown?.priorityFee,
          surcharge: priceBreakdown?.surcharge,
          collectionFee: 0,
          vat: 0,
          r2sFee: 0,
          returnFee: NaN,
        },
      };
    } else {
      throw new Error(messageResponseError.order.create_order_ghn_error);
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
      return {
        message: 'Tạo đơn hàng thành công',
      };
    } catch (error) {
      console.log('🚀 ~ OrderService ~ create ~ error:', error);
      throw new Error(error.message);
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
