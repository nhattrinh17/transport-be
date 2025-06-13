import { Product } from '@entities/index';
import { BaseRepositoryInterface } from 'src/base';
import { FindAllResponse } from 'src/types/common.type';

export interface ProductRepositoryInterface extends BaseRepositoryInterface<Product> {
  findAllCustom(
    condition: object | any[],
    options?: {
      page: number;
      offset: number;
      limit: number;
      projection?: (keyof Product)[];
      sort?: string;
      typeSort?: 'DESC' | 'ASC';
    },
  ): Promise<FindAllResponse<Product>>;
}
