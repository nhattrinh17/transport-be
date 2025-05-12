import { Entity, Column, OneToOne, Index, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderDetail } from './order-detail.entity';
import { ConfigReceiveOrder, PaymentMethodOrder } from '@common/enums';

@Entity('order')
@Unique(['code', 'unit'])
export class Order extends BaseEntity {
  @Index()
  @Column()
  code: string;

  @Column()
  unit: string;

  @Index()
  @Column()
  type: string;

  @Column({ nullable: true })
  sorting: string;

  @Column({ nullable: true })
  shortcode: string;

  @Column({ nullable: true })
  soc: string;

  @Column({
    type: 'enum',
    enum: ConfigReceiveOrder,
  })
  configReceive: ConfigReceiveOrder;

  @Column({
    type: 'enum',
    enum: PaymentMethodOrder,
  })
  paymentMethod: PaymentMethodOrder;

  @Column({ nullable: true })
  senderAddress: string;

  @Column()
  senderPhone: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  phone: string;

  @Column({ default: 0 })
  collection: number;

  @Column({ default: 0 })
  value: number;

  @Column({ default: 0 })
  totalFee: number;

  @Column()
  status: string;

  @Column({ type: 'datetime', nullable: true })
  estimatedDeliveryTime?: Date;

  @OneToOne(() => OrderDetail, (detail) => detail.order, {
    cascade: true,
  })
  detail?: OrderDetail;
}
