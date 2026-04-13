import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

/**
 * INNOVATIVE FEATURE: Live Kitchen Cam
 *
 * Vendors can stream their kitchen preparation live.
 * Customer watching their order being made in real-time.
 *
 * How it works:
 * 1. Vendor places a webcam/phone in kitchen
 * 2. Streams to a simple RTMP/WebRTC endpoint
 * 3. Customer sees a "Watch Kitchen" button on tracking screen
 * 4. Opens a live video feed of their food being prepared
 *
 * Why this is unique:
 * - NO food delivery app has this
 * - Builds massive trust (food safety, hygiene)
 * - Customers love watching their food being made
 * - Viral content potential (share on social media)
 * - Premium vendors can charge more ("transparent kitchen" badge)
 *
 * Implementation:
 * - Use WebRTC for low-latency streaming
 * - Or Agora.io / Mux for managed video
 * - Vendor enables/disables per order or always-on
 */
@Entity('live_kitchens')
export class LiveKitchen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vendor_id: string;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ default: false })
  is_streaming: boolean;

  @Column({ nullable: true })
  stream_url: string;

  @Column({ nullable: true })
  stream_key: string;

  @Column({ default: 0 })
  current_viewers: number;

  @Column({ default: 0 })
  total_views: number;

  @Column({ default: false })
  is_always_on: boolean;
}
