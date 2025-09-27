import { IsInt, IsOptional, IsString, IsPositive, IsEnum } from 'class-validator';
import { Product } from '@prisma/client';

export class CreatePurchaseOrderDto {
  @IsInt()
  supplierId: number;

  @IsString()
  cmdNo: string;

  @IsEnum(Product)
  product: Product;

  @IsInt()
  qtyOrderedL: number;

  @IsInt()
  @IsPositive()
  priceBuyPerL: number;

  @IsInt()
  transitCfa: number;

  @IsInt()
  customsCfa: number;

  @IsOptional()
  @IsInt()
  bankAccountId?: number;
}
