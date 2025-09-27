import { IsString, IsOptional } from 'class-validator';

export class CreateBankDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  swift?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
