import { Order } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { OrderRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';
@Injectable()
export class OrderRepository extends BaseRepositoryAbstract<Order> implements OrderRepositoryInterface {
  constructor(@InjectRepository(Order) private readonly OrderRepository: Repository<Order>) {
    super(OrderRepository);
  }

  findAll(
    condition: any,
    options?: {
      projection: (keyof Order)[];
      sort: string;
      typeSort: 'ASC' | 'DESC';
      page: number;
      offset: number;
      limit: number;
    },
  ): Promise<FindAllResponse<Order>> {
    const queryBuilder = this.OrderRepository.createQueryBuilder('order').leftJoinAndSelect('order.detail', 'detail'); // 👈 Join sang bảng OrderDetail

    // WHERE
    if (!condition?.isPinter) {
      queryBuilder.where(condition);
    } else {
      queryBuilder.where('detail.isPinter = :isPinter', { isPinter: condition.isPinter });
      delete condition.isPinter;
      queryBuilder.andWhere(condition);
    }

    // SELECT projection nếu có
    if (options?.projection?.length) {
      const fields = options.projection.map((field) => `order.${field}`);
      queryBuilder.select(fields);
    }

    // SORT
    queryBuilder.orderBy(`order.${options?.sort || 'createdAt'}`, options?.typeSort || 'DESC');

    // PAGINATION
    if (options?.limit) queryBuilder.take(options.limit);
    if (options?.offset) queryBuilder.skip(options.offset);

    return queryBuilder.getManyAndCount().then(([items, count]) => ({
      pagination: {
        total: count,
        limit: options?.limit,
        page: options?.page,
      },
      data: items,
    }));
  }

  findCountOrderByStatus(filter: any): Promise<any> {
    return this.OrderRepository.createQueryBuilder('order').where(filter).select('order.status', 'status').addSelect('COUNT(order.id)', 'count').groupBy('order.status').getRawMany();
  }

  findOneByIdAndJoin(id: string): Promise<Order | null> {
    return this.OrderRepository.createQueryBuilder('order').leftJoinAndSelect('order.detail', 'detail').leftJoinAndSelect('order.log', 'log').where('order.id = :id', { id }).getOne();
  }
}
