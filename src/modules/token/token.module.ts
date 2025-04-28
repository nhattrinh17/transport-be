import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import RedisService from '@common/services/redis.service';

@Module({
  imports: [HttpModule],
  providers: [TokenService, RedisService],
  exports: [TokenService],
})
export class TokenModule {}
