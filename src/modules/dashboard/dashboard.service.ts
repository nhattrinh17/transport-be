import { Inject, Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { OrderRepositoryInterface } from 'src/database/interface';
import { QueryDashboardDto } from './dto/query-dashboad.dto';
import { Between } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async getDataDashboard(filter: QueryDashboardDto): Promise<any> {
    try {
      const condition = {};
      if (filter.startDate && filter.endDate) {
        condition['createdAt'] = Between(filter.startDate, filter.endDate);
      }
      const data = await this.orderRepository.getDataDashboard(condition);
      return data;
    } catch (error) {
      console.log('🚀 ~ DashboardService ~ getDataDashboard ~ error:', error);
    }
  }
}
