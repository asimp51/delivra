import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUUID()
  @IsOptional()
  order_id?: string;
}
