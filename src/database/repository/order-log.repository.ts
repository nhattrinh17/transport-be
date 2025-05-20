import { OrderLog } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderLogRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class OrderLogRepository extends BaseRepositoryAbstract<OrderLog> implements OrderLogRepositoryInterface {
  constructor(@InjectRepository(OrderLog) private readonly OrderLogRepository: Repository<OrderLog>) {
    super(OrderLogRepository);
  }
}
