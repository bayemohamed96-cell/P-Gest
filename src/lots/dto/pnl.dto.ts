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
  // legacy/compat shape used by older tests/consumers
  calculations?: TripPnlDto[];

  totals: {
    // snake_case (new API)
    capacity_l: number;
    qty_sellable: number;
    revenue: number;
    total_cost: number;
    margin: number;
    // camelCase compatibility
    totalRevenue?: number;
    totalCost?: number;
    totalMargin?: number;
  };
}
