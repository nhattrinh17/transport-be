import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';
import { Pagination, PaginationDto } from '@common/decorators';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperationCustom('Order', 'POST', 'Tạo đơn hàng')
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/print')
  @ApiQuery({ name: 'size', required: false, type: String })
  @ApiQuery({ name: 'original', required: false, type: String })
  @ApiOperationCustom('Order', 'Get', 'In đơn hàng')
  async printOrder(@Param('id') id: string, @Query('size') size: string, @Query('original') original: string) {
    try {
      return await this.orderService.printOrder(id, size, original);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/cancel')
  @ApiOperationCustom('Order', 'Patch', 'Hủy đơn hàng')
  async remove(@Param('id') id: string) {
    try {
      return await this.orderService.cancel(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperationCustom('Order', 'Get', 'Lấy danh sách đơn hàng')
  async getAllOrder(@Pagination() pagination: PaginationDto) {
    try {
      return await this.orderService.findAllOrder(pagination);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // @Get()
  // findAll() {
  //   return this.orderService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
