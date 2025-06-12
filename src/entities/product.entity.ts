import { Entity, Column, DeleteDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';
import { ProductTag } from './product-tag.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column()
  quantity: number;

  @Column()
  status?: string;

  @Column()
  price: number;

  @Column()
  length: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  weight: number;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @OneToMany(() => ProductTag, (productTag) => productTag.product)
  productTags: ProductTag[];
}
