import { describe, it, expect, jest } from '@jest/globals';
import { LotsService } from './lots.service';

describe('LotsService calculatePnL', () => {
  it('calculates per-trip and totals correctly', async () => {
    const service = new LotsService({} as any);

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
    } as any;

    // Mock prisma.lot.findUnique to return our lot (calculatePnL uses prisma.lot.findUnique)
    (service as any).prisma = {
      lot: {
        findUnique: (jest.fn() as any).mockResolvedValue(lot),
      },
    };

    const res: any = await service.calculatePnL(1);

    expect(res).toBeDefined();
    expect(res.calculations).toHaveLength(2);

    // Totals computed manually
    expect(res.totals.totalRevenue).toBe(5985);
    expect(res.totals.totalCost).toBe(6225);
    expect(res.totals.totalMargin).toBe(-240);
  });
});
