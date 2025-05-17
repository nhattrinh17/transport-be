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
    condition: object | any[],
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
    if (condition) {
      Object.entries(condition).forEach(([key, value]) => {
        queryBuilder.andWhere(`order.${key} = :${key}`, { [key]: value });
      });
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
}
