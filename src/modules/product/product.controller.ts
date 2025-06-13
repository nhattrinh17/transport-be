import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, Pagination } from 'src/custom-decorator';
import { PaginationDto } from '@common/decorators';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperationCustom('Product', 'POST')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperationCustom('Product', 'GET')
  findAll(@Pagination() pagination: PaginationDto, @Query() filter: QueryProductDto) {
    return this.productService.findAll(pagination, filter);
  }

  @Get('brief')
  @ApiOperationCustom('Product', 'GET')
  findAllBrief(@Pagination() pagination: PaginationDto, @Query() filter: QueryProductDto) {
    return this.productService.findAllBrief(pagination, filter);
  }

  @Patch(':id')
  @ApiOperationCustom('Product', 'PATCH')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      console.log('🚀 ~ ProductController ~ update ~ error:', error);
      throw new Error(error.message || 'An error occurred while updating the product');
    }
  }

  @Delete(':id')
  @ApiOperationCustom('Product', 'DELETE')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
