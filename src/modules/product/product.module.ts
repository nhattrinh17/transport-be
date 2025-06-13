import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductTag } from '@entities/index';
import { ProductRepository, ProductTagRepository } from 'src/database/repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductTag])],
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
  ],
})
export class ProductModule {}
