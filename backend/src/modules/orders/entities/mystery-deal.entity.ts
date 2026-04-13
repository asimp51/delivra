import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';

/**
 * INNOVATIVE FEATURE: Mystery Deals
 *
 * Vendors can offer "mystery bags" — surprise food at 50-70% off.
 * Customer doesn't know exactly what they'll get, but knows:
 * - The vendor (so they trust the quality)
 * - The category (e.g., "Mystery Burger Bag")
 * - The minimum value (e.g., "$30 worth of food for $12")
 * - The dietary info (e.g., "contains meat, dairy")
 *
 * How it works:
 * 1. Vendor creates a mystery deal with min value + actual items (hidden)
 * 2. Customer sees "Mystery Burger Bag from Al Baik — $12 (worth $30+)"
 * 3. Customer buys it without knowing exact items
 * 4. After purchase, items are revealed
 * 5. Helps vendors sell surplus food, reduces waste
 *
 * Inspired by "Too Good To Go" but integrated into a delivery platform.
 * No food delivery app has this built-in.
 */
@Entity('mystery_deals')
export class MysteryDeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category_hint: string;

  @Column('decimal', { precision: 10, scale: 2 })
  original_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  mystery_price: number;

  @Column('jsonb')
  actual_items: { name: string; quantity: number; value: number }[];

  @Column('jsonb', { default: [] })
  dietary_info: string[];

  @Column({ default: 10 })
  quantity_available: number;

  @Column({ default: 0 })
  quantity_sold: number;

  @Column({ type: 'timestamptz' })
  available_from: Date;

  @Column({ type: 'timestamptz' })
  available_until: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
