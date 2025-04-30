import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto, GetServiceAvailableDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';

@ApiTags('Fee')
@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post('service')
  @ApiOperationCustom('Free Service Available', 'POST', 'Lấy dịch vụ vận chuyển')
  async getService(@Body() dto: GetServiceAvailableDto) {
    try {
      return await this.feeService.getServiceAvailable(dto);
    } catch (error) {
      console.log('🚀 ~ FeeController ~ getService ~ error:', error);
      throw new BadRequestException(error.message);
    }
  }
}
