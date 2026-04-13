import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

/**
 * INNOVATIVE FEATURE: Group Ordering
 *
 * No competitor does this well. Allows friends/coworkers to:
 * 1. One person creates a group order with a share link
 * 2. Others join via link and add their items to the same cart
 * 3. Everyone sees what others are ordering in real-time
 * 4. Host confirms and places one combined order
 * 5. Payment can be split equally or per-person
 * 6. One delivery instead of 5 separate ones
 *
 * Use cases:
 * - Office lunch orders (everyone adds their items)
 * - Family dinner (kids pick their own food)
 * - Party planning (split grocery shopping)
 */

export enum GroupOrderStatus {
  COLLECTING = 'collecting',  // Members are still adding items
  LOCKED = 'locked',          // Host locked the order, ready to checkout
  PLACED = 'placed',          // Order has been placed
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum SplitMethod {
  EQUAL = 'equal',            // Total / number of people
  PER_PERSON = 'per_person',  // Each pays for their own items
  HOST_PAYS = 'host_pays',    // Host pays everything
}

@Entity('group_orders')
export class GroupOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  share_code: string;

  @Column()
  host_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ type: 'enum', enum: GroupOrderStatus, default: GroupOrderStatus.COLLECTING })
  status: GroupOrderStatus;

  @Column({ type: 'enum', enum: SplitMethod, default: SplitMethod.PER_PERSON })
  split_method: SplitMethod;

  @Column({ nullable: true })
  order_id: string;

  @Column({ default: 10 })
  max_members: number;

  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('group_order_members')
export class GroupOrderMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  group_order_id: string;

  @ManyToOne(() => GroupOrder)
  @JoinColumn({ name: 'group_order_id' })
  group_order: GroupOrder;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('jsonb', { default: [] })
  items: { vendor_item_id: string; name: string; quantity: number; price: number; options: any[] }[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ default: false })
  has_paid: boolean;

  @CreateDateColumn()
  joined_at: Date;
}
