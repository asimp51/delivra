import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Delivery Zones Service — geofencing for delivery areas
 *
 * For full PostGIS polygon support, run:
 *   CREATE EXTENSION IF NOT EXISTS postgis;
 *
 * This simplified version uses bounding-box zones (lat/lng min/max)
 * which works for most use cases without PostGIS.
 */

// Simple zone entity (add to a proper entity file for production)
interface DeliveryZone {
  id: string;
  name: string;
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
  delivery_fee: number;
  is_active: boolean;
}

@Injectable()
export class DeliveryZonesService {
  // In-memory zones for now — move to database entity for production
  private zones: DeliveryZone[] = [
    { id: '1', name: 'Downtown', min_lat: 25.18, max_lat: 25.22, min_lng: 55.26, max_lng: 55.30, delivery_fee: 2.0, is_active: true },
    { id: '2', name: 'Uptown', min_lat: 25.22, max_lat: 25.28, min_lng: 55.26, max_lng: 55.32, delivery_fee: 3.5, is_active: true },
    { id: '3', name: 'Suburbs', min_lat: 25.10, max_lat: 25.18, min_lng: 55.20, max_lng: 55.35, delivery_fee: 5.0, is_active: true },
  ];

  getZones() {
    return this.zones.filter((z) => z.is_active);
  }

  getZoneForLocation(lat: number, lng: number): DeliveryZone | null {
    return this.zones.find(
      (z) => z.is_active && lat >= z.min_lat && lat <= z.max_lat && lng >= z.min_lng && lng <= z.max_lng,
    ) || null;
  }

  getDeliveryFee(lat: number, lng: number): number {
    const zone = this.getZoneForLocation(lat, lng);
    return zone?.delivery_fee ?? 5.0; // Default fee if outside all zones
  }

  isDeliverable(lat: number, lng: number): boolean {
    return this.getZoneForLocation(lat, lng) !== null;
  }
}
