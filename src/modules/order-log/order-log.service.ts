import { Inject, Injectable } from '@nestjs/common';
import { OrderLogRepositoryInterface } from 'src/database/interface';
import { OrderLogCreateDto } from './dto';

@Injectable()
export class OrderLogService {
  constructor(
    @Inject('OrderLogRepositoryInterface')
    private readonly orderLogRepository: OrderLogRepositoryInterface,
  ) {}

  createOrderLog(dto: OrderLogCreateDto) {
    return this.orderLogRepository.create(dto);
  }
}
