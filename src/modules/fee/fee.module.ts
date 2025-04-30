import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { TokenModule } from '@modules/token/token.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TokenModule],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
