import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDetailDto, CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, Pagination } from 'src/custom-decorator';
import { PaginationDto } from '@common/decorators';

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperationCustom('Warehouse', 'GET', 'Lấy danh sách kho hàng')
  findAll(@Pagination() pagination: PaginationDto) {
    return this.warehouseService.findAll(pagination);
  }

  @Post()
  @ApiOperationCustom('Warehouse', 'POST', 'Tạo kho hàng')
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Post('detail')
  @ApiOperationCustom('Warehouse', 'POST', 'Tạo kho hàng cho từng đơn vị vận chuyển')
  createDetail(@Body() createWarehouseDto: CreateWarehouseDetailDto) {
    return this.warehouseService.createWarehouseDetail(createWarehouseDto);
  }

  @Patch(':id')
  @ApiOperationCustom('Warehouse', 'Patch')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }
}
