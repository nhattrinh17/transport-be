import { Inject, Injectable } from '@nestjs/common';
import { GhtkOrderStatusDto, NhatTinOrderStatusDto, SuperShipWebhookDto, WebhookGHNDto, WebhookViettelDto } from './dto';
import { OrderDetailRepositoryInterface, OrderRepositoryInterface } from 'src/database/interface';
import { messageResponseError, orderStatusViettel, reasonGHN, statusOrderGHTK, StatusOrderLavaMove, StatusOrderNhatTin, statusSuperShip } from '@common/constants';
import { LalamoveUtils } from 'src/utils';
import { WebhookLalamoveDto } from './dto/webhook-lalamove.dto';
import { OrderLogService } from '@modules/order-log/order-log.service';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    private readonly lalamoveUtils: LalamoveUtils,
    private readonly orderLogService: OrderLogService,
  ) {}

  async handleUpdateOrderViettel(dto: WebhookViettelDto) {
    if (dto.TOKEN !== process.env.TOKEN_VERIFY_VIETTEL) throw new Error(messageResponseError.webhook.token_viettel_invalid);
    const order = await this.orderRepository.findOneByCondition({
      code: dto.ORDER_NUMBER,
      soc: dto.ORDER_REFERENCE,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    const status = orderStatusViettel.find((item) => item.code === dto.ORDER_STATUS);
    if (!status) {
      throw new Error(messageResponseError.webhook.status_viettel_invalid);
    }
    const dataUpdate = {
      status: status.statusSys,
      statusText: status.description,
      estimatedDeliveryStr: dto.EXPECTED_DELIVERY,
      totalFee: dto.MONEY_TOTAL,
    };

    const dataOrderLog = {
      typeUpdate: 'status',
      orderId: order.id,
      statusPrevious: order.statusText,
      statusCurrent: status.description,
      changeBy: 'Viettel',
    };

    await Promise.all([
      this.orderRepository.findOneAndUpdate(
        {
          code: dto.ORDER_NUMBER,
          soc: dto.ORDER_REFERENCE,
        },
        dataUpdate,
      ),
      this.orderLogService.createOrderLog(dataOrderLog),
    ]);

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }

  async handleUpdateOrderGHN(dto: WebhookGHNDto) {
    const order = await this.orderRepository.findOneByCondition({
      code: dto.OrderCode,
      soc: dto.ClientOrderCode,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    const fee = dto.Fee;
    const dataUpdateOrder = {
      status: dto.Description,
      totalFee: fee.Total,
    };
    const dataUpdateOrderDetail = {
      mainFee: fee.MainService,
      otherFee: fee.CODFailedFee + fee.DocumentReturn + fee.DoubleCheck + fee.Insurance + fee.StationDO + fee.StationPU,
      surcharge: fee.DeliverRemoteAreasFee + fee.PickRemoteAreasFee,
      collectionFee: fee.CODFee,
      vat: 0,
      r2sFee: fee.R2S,
      returnFee: fee.Return,
    };
    await Promise.all([
      this.orderRepository.findOneAndUpdate(
        {
          code: dto.OrderCode,
          soc: dto.ClientOrderCode,
        },
        dataUpdateOrder,
      ),
      this.orderDetailRepository.findOneByCondition({
        orderId: order.id,
        dataUpdateOrderDetail,
      }),
    ]);

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }

  async handleUpdateOrderGHTK(dto: GhtkOrderStatusDto) {
    const order = await this.orderRepository.findOneByCondition({
      code: dto.partner_id,
      soc: dto.label_id,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    let status = statusOrderGHTK.find((item) => item.code === dto.status_id);
    if (!status) {
      throw new Error(messageResponseError.webhook.status_ghtk_invalid);
    }
    let statusText = status.description;
    if (dto.reason_code) statusText = `${statusText} - ${reasonGHN.find((item) => item.code == +dto.reason_code).description}`;
    const dataUpdate = {
      status: status.statusSys,
      statusText,
      totalFee: dto.fee,
    };

    await this.orderRepository.findOneAndUpdate(
      {
        code: dto.partner_id,
        soc: dto.label_id,
      },
      dataUpdate,
    );

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }

  async handleUpdateOrderNhatTin(dto: NhatTinOrderStatusDto) {
    const order = await this.orderRepository.findOneByCondition({
      code: dto.bill_no,
      soc: dto.ref_code,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    let status = StatusOrderNhatTin.find((item) => item.id === dto.status_id);
    if (!status) {
      throw new Error(messageResponseError.webhook.status_nhattin_invalid);
    }
    let statusText = status.name;
    if (dto.reason) statusText += ` - ${dto.reason}`;
    const dataUpdate = {
      status: status.statusSys,
      statusText,
      estimatedDeliveryStr: dto.expected_at,
    };

    await this.orderRepository.findOneAndUpdate(
      {
        code: dto.bill_no,
        soc: dto.ref_code,
      },
      dataUpdate,
    );

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }

  async handleUpdateOrderSupership(dto: SuperShipWebhookDto) {
    const order = await this.orderRepository.findOneByCondition({
      code: dto.code,
      soc: dto.soc,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    const dataUpdateOrder = {};
    const dataUpdateOrderDetail = {};
    if (dto.type == 'update_status') {
      const status = statusSuperShip.find((item) => item.key === dto.status);
      if (!status) {
        throw new Error(messageResponseError.webhook.status_supership_invalid);
      }
      dataUpdateOrder['statusText'] = `${status.value} - ${dto.reason_text}`;
      dataUpdateOrder['status'] = status.statusSys;
    } else {
      dataUpdateOrderDetail['weight'] = dto.weight;
      dataUpdateOrderDetail['mainFee'] = dto.fshipment;
      dataUpdateOrderDetail['otherFee'] = dto.finsurance;
      dataUpdateOrder['totalFee'] = dto.fshipment + dto.finsurance;
    }

    await Promise.all([
      this.orderRepository.findOneAndUpdate(
        {
          code: dto.code,
          soc: dto.soc,
        },
        dataUpdateOrder,
      ),
      this.orderDetailRepository.findOneAndUpdate(
        {
          orderId: order.id,
        },
        dataUpdateOrderDetail,
      ),
    ]);

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }

  async checkApiKeyAndDataLalamove(dto: WebhookLalamoveDto) {
    if (dto.apiKey !== process.env.API_KEY_LALAMOVE) throw new Error(messageResponseError.webhook.api_key_invalid);
    const checkSignature = this.lalamoveUtils.checkSignatureLalamove(dto.signature, '/webhook/lalamove', 'POST', dto.timestamp, dto.data);
    if (!checkSignature) throw new Error(messageResponseError.webhook.signature_lalamove_invalid);
  }

  async handleUpdateOrderLalamove(dto: WebhookLalamoveDto) {
    this.checkApiKeyAndDataLalamove(dto);
    const order = await this.orderRepository.findOneByCondition({
      code: dto.eventType == 'ORDER_REPLACED' ? dto.data?.prevOrderId : dto.data?.order.orderId,
    });
    if (!order) {
      throw new Error(messageResponseError.webhook.order_not_found);
    }
    const dataUpdateOrder = {};
    const dataUpdateOrderDetail = {};
    switch (dto.eventType) {
      case 'ORDER_STATUS_CHANGED':
        const status = StatusOrderLavaMove.find((item) => item.status === dto.data?.order.status);
        dataUpdateOrder['status'] = status.statusSys;
        dataUpdateOrder['statusText'] = status.name;
        dataUpdateOrderDetail['shareLink'] = dto.data?.order.shareLink;
        break;
      case 'DRIVER_ASSIGNED':
        dataUpdateOrderDetail['driverName'] = dto.data?.driver.name;
        dataUpdateOrderDetail['driverPhone'] = dto.data?.driver.phone;
        break;
      case 'ORDER_AMOUNT_CHANGED':
        dataUpdateOrder['totalFee'] = dto.data?.order?.price?.totalPrice;
        dataUpdateOrderDetail['mainFee'] = dto.data?.order?.price?.subTotal;
        dataUpdateOrderDetail['otherFee'] = dto.data?.order?.price?.priorityFee;
        break;
      case 'ORDER_REPLACED':
        dataUpdateOrder['code'] = dto.data?.order?.orderId;
        break;
      default:
        break;
    }
    await Promise.all([
      this.orderRepository.findOneAndUpdate(
        {
          code: dto.eventType == 'ORDER_REPLACED' ? dto.data?.prevOrderId : dto.data?.order.orderId,
        },
        dataUpdateOrder,
      ),
      this.orderDetailRepository.findOneAndUpdate(
        {
          orderId: order.id,
        },
        dataUpdateOrderDetail,
      ),
    ]);

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }
}
