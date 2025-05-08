import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Warehouse } from './warehouse.entity';

@Entity('warehouse_detail')
export class WarehouseDetail extends BaseEntity {
  @Column({ type: 'varchar' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.details, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column({ type: 'varchar', comment: 'Mã kho(Mã shop) sẽ là lưu chung cho tất cả các đơn vị' })
  code: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  cusId?: string;

  @Column({ type: 'varchar', nullable: true })
  provinceId?: string;

  @Column({ type: 'varchar', nullable: true })
  districtId?: string;

  @Column({ type: 'varchar', nullable: true })
  wardId?: string;
}
