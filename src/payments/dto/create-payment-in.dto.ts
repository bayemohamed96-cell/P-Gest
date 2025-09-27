import { IsInt, IsOptional, IsString, IsDateString, IsPositive } from 'class-validator';

export class CreatePaymentInDto {
  @IsInt()
  customerId: number;

  @IsDateString()
  date: string;

  @IsString()
  reference: string;

  @IsInt()
  @IsPositive()
  amountCfa: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  bankAccountId?: number;
}
