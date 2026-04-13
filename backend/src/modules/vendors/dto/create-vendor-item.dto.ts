import { IsString, IsOptional, IsNumber, IsUUID, IsBoolean, IsObject, IsArray } from 'class-validator';

export class CreateVendorItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  name_ar?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discounted_price?: number;

  @IsUUID()
  @IsOptional()
  subcategory_id?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @IsNumber()
  @IsOptional()
  sort_order?: number;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @IsArray()
  @IsOptional()
  option_groups?: {
    name: string;
    min_selections: number;
    max_selections: number;
    options: { name: string; price_modifier: number }[];
  }[];
}
