import { OrderProduct } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderProductRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class OrderProductRepository extends BaseRepositoryAbstract<OrderProduct> implements OrderProductRepositoryInterface {
  constructor(@InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>) {
    super(orderProductRepository);
  }
}
