import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateLotDto {
  @IsString()
  lotCode: string;

  @IsString()
  product: string;

  @IsDateString()
  startedAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLotDto {
  @IsOptional()
  @IsString()
  lotCode?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  trips?: any[];
}