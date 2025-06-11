import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@entities/index';
import { OrderRepository } from 'src/database/repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
  ],
})
export class DashboardModule {}
