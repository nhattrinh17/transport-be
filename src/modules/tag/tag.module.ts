import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '@entities/index';
import { TagRepository } from 'src/database/repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [
    TagService,
    {
      provide: 'TagRepositoryInterface',
      useClass: TagRepository,
    },
  ],
})
export class TagModule {}
