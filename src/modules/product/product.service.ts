import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepositoryInterface } from 'src/database/interface';
import { convertToSlug } from 'src/utils';
import { messageResponseError } from '@common/constants';
import { PaginationDto } from '@common/decorators';
import { Not } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async create(dto: CreateProductDto) {
    const slug = convertToSlug(dto.name);
    const checkSlug = await this.productRepository.findOneByCondition({ slug }, ['id']);
    if (checkSlug) {
      throw new Error(messageResponseError.product.product_duplicate);
    }
    return this.productRepository.create({
      ...dto,
      slug,
    });
  }

  findAll(pagination: PaginationDto, filter: QueryProductDto) {
    const condition = {};
    if (filter?.status) {
      condition['status'] = filter.status;
    }
    return this.productRepository.findAll(condition, {
      ...pagination,
    });
  }

  findOne(id: string) {
    return this.productRepository.findOneByCondition({ id });
  }

  async update(id: string, dto: UpdateProductDto) {
    const productById = await this.productRepository.findOneById(id, ['slug']);
    if (!productById) {
      throw new Error(messageResponseError.product.product_not_found);
    }

    if (!dto.name) {
      return this.productRepository.findByIdAndUpdate(id, dto);
    }
    const slug = convertToSlug(dto.name);
    if (slug != productById.slug) {
      const checkSlug = await this.productRepository.findOneByCondition({ slug, id: Not(id) }, ['id']);
      if (checkSlug) {
        throw new Error(messageResponseError.product.product_duplicate);
      }
    }
    return this.productRepository.findByIdAndUpdate(id, {
      ...dto,
      slug,
    });
  }

  async remove(id: string) {
    const productById = await this.productRepository.findOneById(id, ['id']);
    if (!productById) {
      throw new Error(messageResponseError.product.product_not_found);
    }
    return this.productRepository.softDelete(id);
  }
}
