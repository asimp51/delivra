import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { VendorItem } from './vendor-item.entity';
import { VendorSchedule } from './vendor-schedule.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  cover_image_url: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address_line: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  avg_rating: number;

  @Column({ default: 0 })
  total_ratings: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  min_order_amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  delivery_fee: number;

  @Column({ nullable: true })
  avg_prep_time_min: number;

  @Column({ default: false })
  is_open: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 15.0 })
  commission_rate: number;

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => VendorItem, (item) => item.vendor)
  items: VendorItem[];

  @OneToMany(() => VendorSchedule, (schedule) => schedule.vendor)
  schedules: VendorSchedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
