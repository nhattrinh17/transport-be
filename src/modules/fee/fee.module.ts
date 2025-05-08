import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';
import { HttpModule } from '@nestjs/axios';
import { ProvinceModule } from '@modules/province/province.module';

@Module({
  imports: [HttpModule, AxiosInsModule, ProvinceModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
