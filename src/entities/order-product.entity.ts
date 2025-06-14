import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('order_product')
export class OrderProduct {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  productId: string;

  @PrimaryColumn({ type: 'varchar', length: 36 })
  orderId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @ManyToOne(() => Order, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order?: Order;
}
