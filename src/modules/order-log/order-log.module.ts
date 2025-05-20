import { Module } from '@nestjs/common';
import { OrderLogService } from './order-log.service';
import { OrderLogController } from './order-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLog } from '@entities/index';
import { OrderLogRepository } from 'src/database/repository/order-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderLog])],
  controllers: [OrderLogController],
  providers: [
    OrderLogService,
    {
      provide: 'OrderLogRepositoryInterface',
      useClass: OrderLogRepository,
    },
  ],
  exports: [OrderLogService],
})
export class OrderLogModule {}
