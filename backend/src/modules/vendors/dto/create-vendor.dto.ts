import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsUUID()
  category_id: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address_line?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsOptional()
  min_order_amount?: number;

  @IsNumber()
  @IsOptional()
  delivery_fee?: number;

  @IsNumber()
  @IsOptional()
  avg_prep_time_min?: number;
}
