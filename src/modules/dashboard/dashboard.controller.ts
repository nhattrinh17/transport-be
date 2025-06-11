import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Version } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';
import { QueryDashboardDto } from './dto/query-dashboad.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Version('1')
  @ApiOperationCustom('Dashboard', 'GET', 'Lấy thông tin dashboard')
  findAll(@Query() dto: QueryDashboardDto) {
    return this.dashboardService.getDataDashboard(dto);
  }
}
