import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto, GetFeeDto, GetFeeServiceFastDto, GetServiceAvailableDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';

@ApiTags('Fee')
@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post('')
  @ApiOperationCustom('Free Service Available', 'POST', 'Lấy phí vận chuyển')
  async getFee(@Body() dto: GetFeeDto) {
    try {
      return await this.feeService.calculateFee(dto);
    } catch (error) {
      console.log('🚀 ~ FeeController ~ getService ~ error:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('faster')
  @ApiOperationCustom('Free Service Faster', 'POST', 'Lấy phí vận chuyển giao hàng nhanh')
  async getFeeFaster(@Body() dto: GetFeeServiceFastDto) {
    try {
      return await this.feeService.calculateFeeFaster(dto);
    } catch (error) {
      console.log('🚀 ~ FeeController ~ getService ~ error:', error);
      throw new BadRequestException(error.message);
    }
  }

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

  @Get('service-faster')
  @ApiOperationCustom('Free Service Available', 'Get', 'Lấy dịch vụ vận chuyển hỏa tốc')
  async getFaster() {
    try {
      return await this.feeService.getServiceFaster();
    } catch (error) {
      console.log('🚀 ~ FeeController ~ getService ~ error:', error);
      throw new BadRequestException(error.message);
    }
  }
}
