import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entities/index';
import { ProductRepository } from 'src/database/repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
  ],
})
export class ProductModule {}
