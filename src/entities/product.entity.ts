import { Entity, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';
import { ProductTag } from './product-tag.entity';
import { Warehouse } from './warehouse.entity';
import { OrderProduct } from './order-product.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column()
  warehouseId: string;

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

  @OneToMany(() => OrderProduct, (orderProd) => orderProd.product)
  orderProducts: OrderProduct[];

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.details, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;
}
