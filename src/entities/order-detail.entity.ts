import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('order_detail')
export class OrderDetail extends BaseEntity {
  @OneToOne(() => Order, (order) => order.detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', length: 36 })
  orderId: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: false })
  isPODEnabled: boolean;

  @Column({ nullable: true })
  shareLink: string;

  @Column({ default: 0 })
  weight: number;

  @Column({ default: 0 })
  mainFee: number;

  @Column({ default: 0 })
  otherFee: number;

  @Column({ default: 0 })
  surcharge: number;

  @Column({ default: 0 })
  collectionFee: number;

  @Column({ default: 0 })
  vat: number;

  @Column({ default: 0 })
  r2sFee: number;

  @Column({ default: 0 })
  returnFee: number;
}
