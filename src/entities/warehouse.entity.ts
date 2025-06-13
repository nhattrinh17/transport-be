import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WarehouseDetail } from './warehouse-detail.entity';
import { Product } from './product.entity';

@Entity('warehouse')
export class Warehouse extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  personCharge?: string;

  @Column({ type: 'varchar', nullable: true })
  province?: string;

  @Column({ type: 'varchar', nullable: true })
  district?: string;

  @Column({ type: 'varchar', nullable: true })
  ward?: string;

  @OneToMany(() => WarehouseDetail, (detail) => detail.warehouse)
  details: WarehouseDetail[];

  @OneToMany(() => Product, (product) => product.warehouse)
  products: Product[];
}
