import { Module } from '@nestjs/common';
import { AxiosInsService } from './axiosIns.service';
import { HttpModule } from '@nestjs/axios';
import RedisService from '@common/services/redis.service';
import { LalamoveUtils } from 'src/utils/lalamiove.utils';

@Module({
  imports: [HttpModule],
  providers: [AxiosInsService, RedisService, LalamoveUtils],
  exports: [AxiosInsService],
})
export class AxiosInsModule {}
