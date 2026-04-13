import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rider } from './rider.entity';

@Entity('rider_location_log')
export class RiderLocation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rider_id: string;

  @ManyToOne(() => Rider)
  @JoinColumn({ name: 'rider_id' })
  rider: Rider;

  @Column({ nullable: true })
  order_id: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  recorded_at: Date;
}
