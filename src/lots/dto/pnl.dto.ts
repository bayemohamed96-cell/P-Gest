export class TripPnlDto {
  tripId: number;
  capacityL: number;
  costBuy: number;
  costFreight: number;
  shortageNet: number;
  qtySellable: number;
  revenue: number;
  taxes: number;
  totalCost: number;
  margin: number;
}

export class LotsPnlResponseDto {
  trips: TripPnlDto[];
  totals: {
    capacity_l: number;
    qty_sellable: number;
    revenue: number;
    total_cost: number;
    margin: number;
    totalRevenue?: number; // deprecated
    totalCost?: number;    // deprecated
    totalMargin?: number;  // deprecated
  };
  meta?: {
    deprecated?: string[]; // liste des champs à ne plus consommer
    generatedAt: string;
    lotId: number;
  };
  // Conservé encore un court temps pour compatibilité; sera retiré plus tard.
  calculations?: TripPnlDto[]; // deprecated
}
