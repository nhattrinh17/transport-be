import { OrderDetail } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderDetailRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class OrderDetailRepository extends BaseRepositoryAbstract<OrderDetail> implements OrderDetailRepositoryInterface {
  constructor(@InjectRepository(OrderDetail) private readonly OrderDetailRepository: Repository<OrderDetail>) {
    super(OrderDetailRepository);
  }
}
