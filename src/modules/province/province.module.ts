import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import RedisService from '@common/services/redis.service';
import { AxiosInsModule } from '@modules/axiosIns/axiosIns.module';

@Module({
  imports: [AxiosInsModule],
  controllers: [ProvinceController],
  providers: [ProvinceService, RedisService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
