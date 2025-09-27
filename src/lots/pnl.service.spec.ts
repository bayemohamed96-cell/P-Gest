import { describe, test, expect, jest } from '@jest/globals';
import { computePnlForTrip, LotsService } from './lots.service';

// Minimal mocked PrismaService for LotsService
const makePrismaMock = (lot: any) => ({
  lot: {
    findUnique: (jest.fn() as any).mockResolvedValue(lot),
  },
});

describe('PnL logic', () => {
  test('computePnlForTrip: shortage < tolerance => shortageNet = 0', () => {
    const trip = {
      id: 1,
      capacityL: 1000,
      priceBuyPerL: 2,
      freightPerL: 1,
      shortageL: 3,
      toleranceL: 5,
      priceSellPerL: 3,
      transitCfa: 100,
      customsCfa: 50,
      miscCfa: 0,
    };

    const res = computePnlForTrip(trip);
    expect(res.shortageNet).toBe(0);
    expect(res.qtySellable).toBe(1000);
  });

  test('computePnlForTrip: shortage > tolerance => shortageNet > 0', () => {
    const trip = {
      id: 2,
      capacityL: 500,
      priceBuyPerL: 4,
      freightPerL: 2,
      shortageL: 10,
      toleranceL: 3,
      priceSellPerL: 6,
      transitCfa: 50,
      customsCfa: 25,
      miscCfa: 0,
    };

    const res = computePnlForTrip(trip);
    expect(res.shortageNet).toBe(7);
    expect(res.qtySellable).toBe(493);
  });

  test('calculatePnL aggregates totals correctly', async () => {
    const lot = {
      id: 1,
      trips: [
        {
          id: 1,
          capacityL: 1000,
          priceBuyPerL: 2,
          freightPerL: 1,
          shortageL: 10,
          toleranceL: 5,
          priceSellPerL: 3,
          transitCfa: 100,
          customsCfa: 50,
          miscCfa: 0,
        },
        {
          id: 2,
          capacityL: 500,
          priceBuyPerL: 4,
          freightPerL: 2,
          shortageL: 0,
          toleranceL: 0,
          priceSellPerL: 6,
          transitCfa: 50,
          customsCfa: 25,
          miscCfa: 0,
        },
      ],
    };

    const prismaMock = makePrismaMock(lot) as any;
    const service = new LotsService(prismaMock);

    const res: any = await service.calculatePnL(1);

    // Verify calculations length
    expect(res.calculations).toHaveLength(2);

    // Compute expected totals manually
    const t1 = computePnlForTrip(lot.trips[0]);
    const t2 = computePnlForTrip(lot.trips[1]);

    const expectedRevenue = t1.revenue + t2.revenue;
    const expectedTotalCost = t1.totalCost + t2.totalCost;
    const expectedMargin = t1.margin + t2.margin;

    expect(res.totals.totalRevenue).toBe(expectedRevenue);
    expect(res.totals.totalCost).toBe(expectedTotalCost);
    expect(res.totals.totalMargin).toBe(expectedMargin);
  });
});
