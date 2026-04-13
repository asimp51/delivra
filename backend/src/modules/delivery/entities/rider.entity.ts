import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum VehicleType {
  BICYCLE = 'bicycle',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
}

@Entity('riders')
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: VehicleType, default: VehicleType.MOTORCYCLE })
  vehicle_type: VehicleType;

  @Column({ nullable: true })
  license_plate: string;

  @Column({ default: false })
  is_online: boolean;

  @Column({ default: false })
  is_on_delivery: boolean;

  @Column({ default: 0 })
  active_delivery_count: number;

  @Column({ default: 2 })
  max_concurrent_orders: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  current_latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  current_longitude: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  avg_rating: number;

  @Column({ default: 0 })
  total_deliveries: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  wallet_balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
