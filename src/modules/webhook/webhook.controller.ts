import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { GhtkOrderStatusDto, NhatTinOrderStatusDto, WebhookGHNDto, WebhookViettelDto } from './dto';

@Controller('Webhook')
export class WebhookController {
  constructor(private readonly WebhookService: WebhookService) {}

  @Post('viettel')
  @HttpCode(200)
  async handleUpdateOrderViettel(@Body() dto: WebhookViettelDto) {
    return this.WebhookService.handleUpdateOrderViettel(dto);
  }

  @Post('ghn')
  @HttpCode(200)
  async handleUpdateOrderGHN(@Body() dto: WebhookGHNDto) {
    return this.WebhookService.handleUpdateOrderGHN(dto);
  }

  @Post('ghtk')
  @HttpCode(200)
  async handleUpdateOrderGHTK(@Body() dto: GhtkOrderStatusDto) {
    return this.WebhookService.handleUpdateOrderGHTK(dto);
  }

  @Post('nhattin')
  @HttpCode(200)
  async handleUpdateOrderNhatTin(@Body() dto: NhatTinOrderStatusDto) {
    return this.WebhookService.handleUpdateOrderNhatTin(dto);
  }
}
