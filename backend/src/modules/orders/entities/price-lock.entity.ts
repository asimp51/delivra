import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

/**
 * INNOVATIVE FEATURE: Price Lock Guarantee
 *
 * Customer can "lock" a vendor's menu prices for 30 minutes.
 * If vendor raises prices during that window (surge pricing),
 * the customer still pays the locked price.
 *
 * How it works:
 * 1. Customer sees a vendor and taps "Lock Price" button
 * 2. System snapshots all menu prices for that vendor
 * 3. Customer has 30 minutes to complete their order at locked prices
 * 4. Even if vendor enables surge pricing, locked customers pay original price
 * 5. Free for first 3 locks/month, then $0.99 per lock (revenue stream!)
 *
 * No competitor has this. It builds trust during peak hours.
 */
@Entity('price_locks')
export class PriceLock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column('jsonb')
  locked_prices: { item_id: string; name: string; locked_price: number }[];

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
