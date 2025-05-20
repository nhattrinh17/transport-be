import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderDetail } from '@entities/index';
import { OrderDetailRepository, OrderRepository } from 'src/database/repository';
import { OrderLogModule } from '@modules/order-log/order-log.module';

@Module({
  imports: [OrderLogModule, AxiosInsModule, TypeOrmModule.forFeature([Order, OrderDetail])],
  controllers: [OrderController],
  providers: [
    OrderService,
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
export class OrderModule {}
