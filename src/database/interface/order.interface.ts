import { Order } from '@entities/index';
import { BaseRepositoryInterface } from 'src/base';

export interface OrderRepositoryInterface extends BaseRepositoryInterface<Order> {
  findCountOrderByStatus(): Promise<any>;
}
