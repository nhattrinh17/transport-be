import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { GhtkOrderStatusDto, NhatTinOrderStatusDto, SuperShipWebhookDto, WebhookGHNDto, WebhookLalamoveDto, WebhookViettelDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly WebhookService: WebhookService) {}

  @Post('viettel')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ Viettel')
  async handleUpdateOrderViettel(@Body() dto: WebhookViettelDto) {
    return this.WebhookService.handleUpdateOrderViettel(dto);
  }

  @Post('ghn')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ GHN')
  async handleUpdateOrderGHN(@Body() dto: WebhookGHNDto) {
    return this.WebhookService.handleUpdateOrderGHN(dto);
  }

  @Post('ghtk')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ GHTK')
  async handleUpdateOrderGHTK(@Body() dto: GhtkOrderStatusDto) {
    return this.WebhookService.handleUpdateOrderGHTK(dto);
  }

  @Post('nhattin')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ NhatTin')
  async handleUpdateOrderNhatTin(@Body() dto: NhatTinOrderStatusDto) {
    return this.WebhookService.handleUpdateOrderNhatTin(dto);
  }

  @Post('supership')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ SuperShip')
  async handleUpdateOrderSuperShip(@Body() dto: SuperShipWebhookDto) {
    return this.WebhookService.handleUpdateOrderSupership(dto);
  }

  @Post('lalamove')
  @HttpCode(200)
  @ApiOperationCustom('Webhook', 'POST', 'Nhận thông báo từ Lalamove')
  async handleUpdateOrderLalamove(@Body() dto: WebhookLalamoveDto) {
    return this.WebhookService.handleUpdateOrderLalamove(dto);
  }
}
