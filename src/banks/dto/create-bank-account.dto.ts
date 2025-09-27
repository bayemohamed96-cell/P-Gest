import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateBankAccountDto {
  @IsInt()
  bankId: number;

  @IsString()
  accountNo: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
