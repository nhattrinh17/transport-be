import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct, Product, ProductTag } from '@entities/index';
import { ProductRepository, ProductTagRepository } from 'src/database/repository';
import { OrderProductRepository } from 'src/database/repository/order-product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductTag, OrderProduct])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    {
      provide: 'ProductTagRepositoryInterface',
      useClass: ProductTagRepository,
    },
    {
      provide: 'OrderProductRepositoryInterface',
      useClass: OrderProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
