import { Product } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { ProductRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';
@Injectable()
export class ProductRepository extends BaseRepositoryAbstract<Product> implements ProductRepositoryInterface {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
    super(productRepository);
  }

  async findAllCustom(condition: object | any[], options?: { projection: (keyof Product)[]; sort: string; typeSort: 'ASC' | 'DESC'; page: number; offset: number; limit: number }): Promise<FindAllResponse<Product>> {
    const qb = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.productTags', 'productTag').leftJoinAndSelect('productTag.tag', 'tag');

    qb.where(condition);

    if (options?.projection?.length) {
      qb.select(options.projection.map((field) => `product.${field}`));
    }

    // Sắp xếp
    if (options?.sort) {
      qb.orderBy(`product.${options.sort}`, options.typeSort || 'ASC');
    }

    // Phân trang
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = options?.offset ?? (page - 1) * limit;

    qb.skip(offset).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }
}
