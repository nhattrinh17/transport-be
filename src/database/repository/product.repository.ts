import { Product } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { ProductRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProductRepository extends BaseRepositoryAbstract<Product> implements ProductRepositoryInterface {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
    super(productRepository);
  }
}
