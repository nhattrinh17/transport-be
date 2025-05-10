import { Warehouse } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { WarehouseRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class WarehouseRepository extends BaseRepositoryAbstract<Warehouse> implements WarehouseRepositoryInterface {
  constructor(@InjectRepository(Warehouse) private readonly warehouseRepository: Repository<Warehouse>) {
    super(warehouseRepository);
  }
}
