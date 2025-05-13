import { Inject, Injectable } from '@nestjs/common';
import { GhtkOrderStatusDto, NhatTinOrderStatusDto, SuperShipWebhookDto, WebhookGHNDto, WebhookViettelDto } from './dto';
import { OrderDetailRepositoryInterface, OrderRepositoryInterface } from 'src/database/interface';
import { messageResponseError, orderStatusViettel, reasonGHN, statusOrderGHTK, StatusOrderNhatTin, statusSuperShip } from '@common/constants';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
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
    const statusText = orderStatusViettel.find((item) => item.code === dto.ORDER_STATUS).description;
    if (!statusText) {
      throw new Error(messageResponseError.webhook.status_viettel_invalid);
    }
    const dataUpdate = {
      status: statusText,
      estimatedDeliveryStr: dto.EXPECTED_DELIVERY,
      totalFee: dto.MONEY_TOTAL,
    };

    await this.orderRepository.findOneAndUpdate(
      {
        code: dto.ORDER_NUMBER,
        soc: dto.ORDER_REFERENCE,
      },
      dataUpdate,
    );

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
    let statusText = statusOrderGHTK.find((item) => item.code === dto.status_id).description;
    if (!statusText) {
      throw new Error(messageResponseError.webhook.status_ghtk_invalid);
    }
    if (dto.reason_code) statusText = `${statusText} - ${reasonGHN.find((item) => item.code == +dto.reason_code).description}`;
    const dataUpdate = {
      status: statusText,
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
    let statusText = StatusOrderNhatTin.find((item) => item.id === dto.status_id).name;
    if (!statusText) {
      throw new Error(messageResponseError.webhook.status_nhattin_invalid);
    }
    if (dto.reason) statusText += ` - ${dto.reason}`;
    const dataUpdate = {
      status: statusText,
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
      const statusText = statusSuperShip.find((item) => item.key === dto.status).value;
      if (!statusText) {
        throw new Error(messageResponseError.webhook.status_supership_invalid);
      }
      dataUpdateOrder['status'] = `${statusText} - ${dto.reason_text}`;
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
}
