import { IsString, IsOptional, IsEnum, IsUUID, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

class OrderItemDto {
  @IsUUID()
  vendor_item_id: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  special_instructions?: string;

  @IsArray()
  @IsOptional()
  selected_options?: any[];
}

export class CreateOrderDto {
  @IsUUID()
  vendor_id: string;

  @IsUUID()
  delivery_address_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

  @IsString()
  @IsOptional()
  special_instructions?: string;

  @IsString()
  @IsOptional()
  promo_code?: string;
}
