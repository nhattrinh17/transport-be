import { Module } from '@nestjs/common';
import { AxiosInsService } from './axiosIns.service';
import { HttpModule } from '@nestjs/axios';
import RedisService from '@common/services/redis.service';

@Module({
  imports: [HttpModule],
  providers: [AxiosInsService, RedisService],
  exports: [AxiosInsService],
})
export class AxiosInsModule {}
