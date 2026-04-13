import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { Category } from '../../categories/entities/category.entity';
import { ItemOptionGroup } from './item-option-group.entity';

@Entity('vendor_items')
export class VendorItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ nullable: true })
  subcategory_id: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Category;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_ar: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discounted_price: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  is_available: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @Column('jsonb', { default: {} })
  attributes: Record<string, any>;

  @OneToMany(() => ItemOptionGroup, (group) => group.vendor_item)
  option_groups: ItemOptionGroup[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
