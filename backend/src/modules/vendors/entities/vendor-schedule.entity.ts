import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('vendor_schedules')
export class VendorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column('smallint')
  day_of_week: number;

  @Column('time')
  open_time: string;

  @Column('time')
  close_time: string;

  @Column({ default: false })
  is_closed: boolean;
}
