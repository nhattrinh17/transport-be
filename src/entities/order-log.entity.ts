import { Entity, Column, JoinColumn, OneToOne, DeleteDateColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('order_log')
export class OrderLog extends BaseEntity {
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.log, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  typeUpdate: string;

  @Column()
  statusPrevious: string;

  @Column()
  statusCurrent: string;

  @Column()
  changeBy: string;
}
