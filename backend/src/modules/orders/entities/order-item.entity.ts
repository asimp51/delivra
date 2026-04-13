import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { VendorItem } from '../../vendors/entities/vendor-item.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  vendor_item_id: string;

  @ManyToOne(() => VendorItem)
  @JoinColumn({ name: 'vendor_item_id' })
  vendor_item: VendorItem;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column({ nullable: true })
  special_instructions: string;

  @Column('jsonb', { default: [] })
  selected_options: any[];
}
