import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse, WarehouseDetail } from '@entities/index';
import { WarehouseDetailRepository, WarehouseRepository } from 'src/database/repository';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';

@Module({
  imports: [AxiosInsModule, TypeOrmModule.forFeature([Warehouse, WarehouseDetail])],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    {
      provide: 'WarehouseRepositoryInterface',
      useClass: WarehouseRepository,
    },
    {
      provide: 'WarehouseDetailRepositoryInterface',
      useClass: WarehouseDetailRepository,
    },
  ],
})
export class WarehouseModule {}
