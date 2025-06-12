import { ProductTag } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { ProductTagRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProductTagRepository extends BaseRepositoryAbstract<ProductTag> implements ProductTagRepositoryInterface {
  constructor(@InjectRepository(ProductTag) private readonly productTagRepository: Repository<ProductTag>) {
    super(productTagRepository);
  }
}
