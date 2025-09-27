import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsInt, IsOptional, IsPositive } from 'class-validator';

class LotTripUpdateItemDto {
  @IsInt()
  cisternId: number;

  @IsInt()
  tractorId: number;

  @IsInt()
  driverId: number;

  @IsInt()
  destinationId: number;

  @IsInt() @IsPositive()
  capacityL: number;

  @IsInt() @IsPositive()
  priceBuyPerL: number;

  @IsInt() @IsPositive()
  freightPerL: number;

  @IsOptional() @IsInt()
  toleranceL?: number;

  @IsOptional() @IsInt()
  shortageL?: number;

  @IsInt() @IsPositive()
  priceSellPerL: number;

  @IsOptional() @IsInt()
  transitCfa?: number;

  @IsOptional() @IsInt()
  customsCfa?: number;

  @IsOptional() @IsInt()
  miscCfa?: number;
}

export class UpdateLotTripsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LotTripUpdateItemDto)
  trips: LotTripUpdateItemDto[];
}
