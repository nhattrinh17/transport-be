import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get()
  findAll() {
    return this.feeService.getServiceAvailable();
  }
}
