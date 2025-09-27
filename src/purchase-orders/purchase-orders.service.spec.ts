import { PurchaseOrdersService } from './purchase-orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PurchaseOrdersService', () => {
  let svc: PurchaseOrdersService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      bankAccount: { findUnique: jest.fn() },
      supplier: { findUnique: jest.fn() },
      purchaseOrder: { create: jest.fn().mockResolvedValue({ id: 100 }) },
    };

    svc = new PurchaseOrdersService(prisma as any);
  });

  it('should throw if bankAccountId not found', async () => {
    (prisma.bankAccount.findUnique as any).mockResolvedValue(null);

    await expect(svc.createPO({
      supplierId: 1,
      cmdNo: 'CMD-1',
      product: 'GASOIL' as any,
      qtyOrderedL: 1000,
      priceBuyPerL: 500,
      transitCfa: 1000,
      customsCfa: 2000,
      bankAccountId: 999,
    } as any)).rejects.toThrow(BadRequestException);
  });

  it('should create PO when bankAccount is valid', async () => {
    (prisma.bankAccount.findUnique as any).mockResolvedValue({ id: 2, active: true });
    (prisma.supplier.findUnique as any).mockResolvedValue({ id: 1 });
    (prisma.purchaseOrder.create as any).mockResolvedValue({ id: 101 });

    const res = await svc.createPO({
      supplierId: 1,
      cmdNo: 'CMD-2',
      product: 'GASOIL' as any,
      qtyOrderedL: 2000,
      priceBuyPerL: 500,
      transitCfa: 1000,
      customsCfa: 2000,
      bankAccountId: 2,
    } as any);

    expect(res).toEqual({ id: 101 });
  });
});
