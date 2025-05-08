import { Entity, Column, OneToOne, Index, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('order')
@Unique(['code', 'type'])
export class Order extends BaseEntity {
  @Index()
  @Column()
  code: string;

  @Index()
  @Column()
  type: string;

  @Column({ nullable: true })
  sorting: string;

  @Column({ nullable: true })
  shortcode: string;

  @Column({ nullable: true })
  soc: string;

  @Column()
  note: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  phoneReceiver: string;

  @Column({ default: false })
  isPODEnabled: boolean;

  @Column({ nullable: true })
  shareLink: string;

  @Column()
  collection: number;

  @Column({ default: 0 })
  value: number;

  @Column()
  status: string;

  @Column({ type: 'datetime', nullable: true })
  estimatedDeliveryTime: Date;

  @OneToOne(() => OrderDetail, (detail) => detail.order, { cascade: true })
  detail: OrderDetail;
}
