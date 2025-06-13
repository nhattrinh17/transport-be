import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { OrderProductRepositoryInterface, ProductRepositoryInterface, ProductTagRepositoryInterface } from 'src/database/interface';
import { convertToSlug } from 'src/utils';
import { messageResponseError } from '@common/constants';
import { PaginationDto } from '@common/decorators';
import { Like, Not } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto';
import { ItemProductDto } from '@modules/fee/dto/create-fee.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('ProductTagRepositoryInterface')
    private readonly productTagRepository: ProductTagRepositoryInterface,
    @Inject('OrderProductRepositoryInterface')
    private readonly orderProductRepository: OrderProductRepositoryInterface,
  ) {}

  async handleCreateOrderProduct(dto: ItemProductDto[], orderId: string, warehouseId?: string) {
    const createOrUpdateProd = await Promise.all(
      dto.map(async (i) => {
        const slug = convertToSlug(i.name);
        const checkSlug = await this.productRepository.findOneByCondition({ slug, warehouseId }, ['id']);
        if (checkSlug) {
          i.code = checkSlug.id;
          return this.productRepository.decrease(checkSlug.id, 'quantity', i.quantity);
        }
        const product = await this.productRepository.create({
          ...i,
          slug,
          quantity: 0,
        });
        i.code = product.id;
        return i;
      }),
    );
    const orderProducts = dto.map((item) => ({
      productId: item.code,
      orderId,
    }));
    return this.orderProductRepository.insertMany(orderProducts);
  }

  async create(dto: CreateProductDto) {
    const slug = convertToSlug(dto.name);
    const checkSlug = await this.productRepository.findOneByCondition({ slug, warehouseId: dto.warehouseId }, ['id']);
    if (checkSlug) {
      throw new Error(messageResponseError.product.product_duplicate);
    }
    const product = await this.productRepository.create({
      ...dto,
      slug,
    });
    await Promise.all(
      dto.tags.map(async (tag) => {
        return this.productTagRepository.create({
          productId: product.id,
          tagId: tag,
        });
      }),
    );
    return 'Product created successfully';
  }

  async findAll(pagination: PaginationDto, filter: QueryProductDto) {
    try {
      const condition = {};
      if (filter?.status) {
        condition['status'] = filter.status;
      }
      if (filter?.search) {
        condition['name'] = Like(`%${filter.search}%`);
      }
      return await this.productRepository.findAllCustom(condition, {
        ...pagination,
      });
    } catch (error) {
      console.log('🚀 ~ ProductService ~ findAll ~ error:', error);
    }
  }

  async findAllBrief(pagination: PaginationDto, filter: QueryProductDto) {
    try {
      const condition = {};
      if (filter?.status) {
        condition['status'] = filter.status;
      }
      if (filter?.search) {
        condition['name'] = Like(`%${filter.search}%`);
      }
      return await this.productRepository.findAll(condition, {
        ...pagination,
        projection: ['id', 'name', 'price', 'length', 'width', 'height', 'weight', 'status'],
      });
    } catch (error) {
      console.log('🚀 ~ ProductService ~ findAllBrief ~ error:', error);
    }
  }

  findOne(id: string) {
    return this.productRepository.findOneByCondition({ id });
  }

  async update(id: string, dto: UpdateProductDto) {
    const productById = await this.productRepository.findOneById(id, ['id', 'slug', 'name']);
    if (!productById) {
      throw new Error(messageResponseError.product.product_not_found);
    }

    const { tags, ...dataProd } = dto;
    if (tags) {
      await this.productTagRepository.permanentlyDeleteByCondition({ productId: id });
      const tagCreates = tags.map((tagId) => ({ productId: id, tagId }));
      await this.productTagRepository.insertMany(tagCreates);
    }

    const slug = convertToSlug(dataProd.name);
    if (dataProd.name && slug !== productById.slug) {
      const checkSlug = await this.productRepository.findOneByCondition({ slug, warehouseId: productById.warehouseId, id: Not(id) }, ['id']);
      if (checkSlug) {
        throw new Error(messageResponseError.product.product_duplicate);
      }
      dataProd['slug'] = slug;
    }

    return this.productRepository.findByIdAndUpdate(id, dataProd);
  }

  async remove(id: string) {
    const productById = await this.productRepository.findOneById(id, ['id']);
    if (!productById) {
      throw new Error(messageResponseError.product.product_not_found);
    }
    return this.productRepository.softDelete(id);
  }
}
