import { Tag } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from 'src/base';
import { TagRepositoryInterface } from '../interface/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class TagRepository extends BaseRepositoryAbstract<Tag> implements TagRepositoryInterface {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {
    super(tagRepository);
  }
}
