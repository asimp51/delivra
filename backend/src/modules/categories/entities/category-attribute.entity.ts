import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

export enum AttributeType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
}

@Entity('category_attributes')
export class CategoryAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, (cat) => cat.attributes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  attribute_name: string;

  @Column({ type: 'enum', enum: AttributeType, default: AttributeType.TEXT })
  attribute_type: AttributeType;

  @Column('jsonb', { default: [] })
  options: string[];

  @Column({ default: false })
  is_required: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;
}
