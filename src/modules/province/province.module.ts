import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { HttpModule } from '@nestjs/axios';
import RedisService from '@common/services/redis.service';

@Module({
  imports: [HttpModule],
  controllers: [ProvinceController],
  providers: [ProvinceService, RedisService],
})
export class ProvinceModule {}
