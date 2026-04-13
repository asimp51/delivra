import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ItemOptionGroup } from './item-option-group.entity';

@Entity('item_options')
export class ItemOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  group_id: string;

  @ManyToOne(() => ItemOptionGroup, (group) => group.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: ItemOptionGroup;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price_modifier: number;

  @Column({ default: true })
  is_available: boolean;

  @Column({ default: 0 })
  sort_order: number;
}
