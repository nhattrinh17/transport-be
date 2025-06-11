import { Order } from '@entities/index';
import { BaseRepositoryInterface } from 'src/base';

export interface OrderRepositoryInterface extends BaseRepositoryInterface<Order> {
  findCountOrderByStatus(filter): Promise<any>;

  findOneByIdAndJoin(id: string): Promise<Order | null>;

  getDataDashboard(condition: any): Promise<any>;
}
