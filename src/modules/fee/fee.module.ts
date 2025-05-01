import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, AxiosInsModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
