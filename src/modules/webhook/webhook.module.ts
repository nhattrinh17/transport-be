import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderDetail } from '@entities/index';
import { OrderDetailRepository, OrderRepository } from 'src/database/repository';
import { LalamoveUtils } from 'src/utils';
import { OrderLogModule } from '@modules/order-log/order-log.module';

@Module({
  imports: [OrderLogModule, TypeOrmModule.forFeature([Order, OrderDetail])],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    LalamoveUtils,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'OrderDetailRepositoryInterface',
      useClass: OrderDetailRepository,
    },
  ],
})
export class WebhookModule {}
