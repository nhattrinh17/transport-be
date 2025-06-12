import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductTag } from './product-tag.entity';

@Entity('tag')
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar' }) k;
  description: string;

  @Column({ type: 'varchar', length: 256 })
  slug: string;

  @OneToMany(() => ProductTag, (productTag) => productTag.tag)
  productTags: ProductTag[];
}
