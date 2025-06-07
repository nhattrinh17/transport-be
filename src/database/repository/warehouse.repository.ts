import { Warehouse } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { WarehouseRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';
@Injectable()
export class WarehouseRepository extends BaseRepositoryAbstract<Warehouse> implements WarehouseRepositoryInterface {
  constructor(@InjectRepository(Warehouse) private readonly warehouseRepository: Repository<Warehouse>) {
    super(warehouseRepository);
  }

  async findAll(
    condition: object | any[],
    options?: {
      projection: (keyof Warehouse)[];
      sort: string;
      typeSort: 'ASC' | 'DESC';
      page: number;
      offset: number;
      limit: number;
    },
  ): Promise<FindAllResponse<Warehouse>> {
    const queryBuilder = this.warehouseRepository.createQueryBuilder('warehouse').leftJoinAndSelect('warehouse.details', 'details').where(condition);

    // SELECT projection nếu có
    if (options?.projection?.length) {
      const fields = options.projection.map((field) => `warehouse.${field}`);
      queryBuilder.select(fields);
    }

    // PAGINATION
    if (options?.limit) queryBuilder.take(options.limit);
    if (options?.offset) queryBuilder.skip(options.offset);

    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      pagination: {
        total: count,
        limit: options?.limit,
        page: options?.page,
      },
      data: items,
    };
  }
}
