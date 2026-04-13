import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { VendorItem } from './vendor-item.entity';
import { ItemOption } from './item-option.entity';

@Entity('item_option_groups')
export class ItemOptionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendor_item_id: string;

  @ManyToOne(() => VendorItem, (item) => item.option_groups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_item_id' })
  vendor_item: VendorItem;

  @Column()
  name: string;

  @Column({ default: 0 })
  min_selections: number;

  @Column({ default: 1 })
  max_selections: number;

  @Column({ default: 0 })
  sort_order: number;

  @OneToMany(() => ItemOption, (option) => option.group)
  options: ItemOption[];
}
