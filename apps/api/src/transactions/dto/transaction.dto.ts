import { IsNotEmpty, IsNumber, IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class TransactionItemDto {
  @IsString()
  @IsOptional()
  product_id?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;
}

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  branch_id?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  vat: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  @IsOptional()
  items?: TransactionItemDto[];
}
