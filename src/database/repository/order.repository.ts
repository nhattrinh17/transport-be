import { Order } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class OrderRepository extends BaseRepositoryAbstract<Order> implements OrderRepositoryInterface {
  constructor(@InjectRepository(Order) private readonly OrderRepository: Repository<Order>) {
    super(OrderRepository);
  }
}
