import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * INNOVATIVE FEATURE: AI Smart Reorder
 *
 * Learns user's ordering patterns and suggests:
 * - "It's Friday 7pm — you usually order Pizza Hut. Reorder?"
 * - "You're running low on milk (ordered 7 days ago). Reorder groceries?"
 * - "Your weekly meal prep order is ready — same as last week?"
 *
 * How it works:
 * 1. Track every order with: vendor, items, day_of_week, time_of_day
 * 2. After 3+ orders, detect patterns (e.g., "Friday dinner = Pizza Hut")
 * 3. Send push notification at the predicted time
 * 4. One-tap reorder with same items, same address, same payment
 *
 * No competitor does this. Uber Eats has "reorder" but not predictive timing.
 */
@Entity('order_patterns')
export class OrderPattern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  vendor_id: string;

  @Column()
  vendor_name: string;

  @Column('smallint')
  day_of_week: number;

  @Column('smallint')
  hour_of_day: number;

  @Column('jsonb')
  typical_items: { name: string; vendor_item_id: string; quantity: number }[];

  @Column({ default: 1 })
  occurrence_count: number;

  @Column({ default: 0.0, type: 'decimal', precision: 5, scale: 2 })
  confidence: number;

  @Column({ default: true })
  is_active: boolean;
}
