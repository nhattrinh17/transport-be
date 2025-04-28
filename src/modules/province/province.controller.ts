import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceDto, GetDistrictDto, GetWardsDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  getAllProvince() {
    return this.provinceService.getAllProvince();
  }

  @Get('district')
  @ApiQuery({ name: 'provinceIdViettel', type: String, description: 'Id tỉnh' })
  @ApiQuery({ name: 'provinceIdGHN', type: String, description: 'Id tỉnh' })
  async getAllDistrict(@Query() query: GetDistrictDto) {
    try {
      return await this.provinceService.getAllDistrict(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('ward')
  @ApiQuery({ name: 'districtIdViettel', type: String, description: 'Id tỉnh' })
  @ApiQuery({ name: 'districtIdGHN', type: String, description: 'Id tỉnh' })
  async getAllWards(@Query() query: GetWardsDto) {
    try {
      return await this.provinceService.getAllWard(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
