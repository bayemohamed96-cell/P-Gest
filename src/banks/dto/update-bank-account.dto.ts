import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  accountNo?: string;

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
