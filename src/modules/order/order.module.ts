import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderDetail } from '@entities/index';
import { OrderDetailRepository, OrderRepository } from 'src/database/repository';
import { OrderLogModule } from '@modules/order-log/order-log.module';
import { ProductModule } from '@modules/product/product.module';
import RedisService from '@common/services/redis.service';

@Module({
  imports: [ProductModule, OrderLogModule, AxiosInsModule, TypeOrmModule.forFeature([Order, OrderDetail])],
  controllers: [OrderController],
  providers: [
    OrderService,
    RedisService,
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
