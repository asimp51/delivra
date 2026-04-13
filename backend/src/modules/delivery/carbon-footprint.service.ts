import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonFootprint } from './entities/carbon-footprint.entity';

// CO2 emissions per km by vehicle type (kg CO2/km)
const EMISSIONS: Record<string, number> = {
  bicycle: 0,
  motorcycle: 0.072,
  car: 0.192,
};
const CAR_BASELINE = 0.192; // Compare everything against a car

@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonFootprint) private cfRepo: Repository<CarbonFootprint>,
  ) {}

  async recordDelivery(userId: string, orderId: string, distanceKm: number, vehicleType: string) {
    const emitted = distanceKm * (EMISSIONS[vehicleType] || 0);
    const savedVsCar = distanceKm * CAR_BASELINE - emitted;

    const record = this.cfRepo.create({
      user_id: userId,
      order_id: orderId,
      distance_km: distanceKm,
      vehicle_type: vehicleType,
      co2_emitted_kg: emitted,
      co2_saved_vs_car_kg: Math.max(0, savedVsCar),
      is_green_delivery: vehicleType === 'bicycle',
    });

    return this.cfRepo.save(record);
  }

  async getUserFootprint(userId: string) {
    const records = await this.cfRepo.find({ where: { user_id: userId } });
    const totalSaved = records.reduce((sum, r) => sum + Number(r.co2_saved_vs_car_kg), 0);
    const totalEmitted = records.reduce((sum, r) => sum + Number(r.co2_emitted_kg), 0);
    const greenDeliveries = records.filter((r) => r.is_green_delivery).length;
    const treesEquivalent = totalSaved / 21; // 1 tree absorbs ~21kg CO2/year

    return {
      total_deliveries: records.length,
      total_co2_saved_kg: Math.round(totalSaved * 100) / 100,
      total_co2_emitted_kg: Math.round(totalEmitted * 100) / 100,
      green_deliveries: greenDeliveries,
      trees_equivalent: Math.round(treesEquivalent * 10) / 10,
      eco_badge: totalSaved > 50 ? 'Eco Champion' : totalSaved > 20 ? 'Green Rider' : totalSaved > 5 ? 'Eco Starter' : 'New',
    };
  }
}
