import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * INNOVATIVE FEATURE: Carbon Footprint Tracker
 *
 * Shows customers and riders the environmental impact of their deliveries.
 * - Tracks CO2 saved when rider uses bicycle vs car
 * - Shows "X trees planted" equivalent
 * - Monthly eco-report
 * - "Green delivery" option — wait longer, rider batches multiple nearby deliveries
 * - Eco-badges for customers who choose green delivery
 *
 * Why this is unique:
 * - No delivery platform tracks or displays this
 * - Appeals to environmentally conscious customers
 * - Good PR / marketing differentiator
 * - "Green delivery" discount incentivizes eco-friendly behavior
 */
@Entity('carbon_footprints')
export class CarbonFootprint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  order_id: string;

  @Column('decimal', { precision: 8, scale: 4 })
  distance_km: number;

  @Column()
  vehicle_type: string;

  @Column('decimal', { precision: 8, scale: 4 })
  co2_emitted_kg: number;

  @Column('decimal', { precision: 8, scale: 4 })
  co2_saved_vs_car_kg: number;

  @Column({ default: false })
  is_green_delivery: boolean;

  @CreateDateColumn()
  created_at: Date;
}
