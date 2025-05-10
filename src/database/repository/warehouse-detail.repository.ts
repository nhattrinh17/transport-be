import { WarehouseDetail } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { WarehouseDetailRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class WarehouseDetailRepository extends BaseRepositoryAbstract<WarehouseDetail> implements WarehouseDetailRepositoryInterface {
  constructor(@InjectRepository(WarehouseDetail) private readonly warehouseWarehouseDetailRepository: Repository<WarehouseDetail>) {
    super(warehouseWarehouseDetailRepository);
  }
}
