import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Tag } from './tag.entity';

@Entity('product_tag')
export class ProductTag {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  productId: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  tagId: string;

  @ManyToOne(() => Product, (product) => product.productTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Tag, (tag) => tag.productTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @CreateDateColumn()
  createdAt: Date;

  // Thêm bất kỳ metadata nào khác nếu cần
  // @Column({ default: false }) isFeatured: boolean;
}
