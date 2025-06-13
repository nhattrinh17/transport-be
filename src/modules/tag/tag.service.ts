import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepositoryInterface } from 'src/database/interface';
import { convertToSlug } from 'src/utils';
import { messageResponseError } from '@common/constants';
import { Not } from 'typeorm';

@Injectable()
export class TagService {
  constructor(@Inject('TagRepositoryInterface') private readonly tagRepository: TagRepositoryInterface) {}

  async create(dto: CreateTagDto) {
    const slug = convertToSlug(dto.name);
    const checkSlug = await this.tagRepository.findOneByCondition({ slug }, ['id']);
    if (checkSlug) {
      throw new Error(messageResponseError.tag.tag_duplicate);
    }
    return this.tagRepository.create({
      ...dto,
      slug,
    });
  }

  async findAll() {
    try {
      return await this.tagRepository.findAll({}, { limit: 100, offset: 0, page: 1 });
    } catch (error) {
      console.log('🚀 ~ TagService ~ findAll ~ error:', error);
    }
  }

  async update(id: string, dto: UpdateTagDto) {
    const productById = await this.tagRepository.findOneById(id, ['slug']);
    if (!productById) {
      throw new Error(messageResponseError.product.product_not_found);
    }

    if (!dto.name) {
      return this.tagRepository.findByIdAndUpdate(id, dto);
    }
    const slug = convertToSlug(dto.name);
    if (slug != productById.slug) {
      const checkSlug = await this.tagRepository.findOneByCondition({ slug, id: Not(id) }, ['id']);
      if (checkSlug) {
        throw new Error(messageResponseError.product.product_duplicate);
      }
    }
    return this.tagRepository.findByIdAndUpdate(id, {
      ...dto,
      slug,
    });
  }

  remove(id: string) {
    return this.tagRepository.permanentlyDelete(id);
  }
}
