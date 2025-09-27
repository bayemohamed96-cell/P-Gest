import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PaymentsService', () => {
  let svc: PaymentsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      bankAccount: { findUnique: jest.fn() },
      customer: { findUnique: jest.fn() },
      paymentIn: { create: jest.fn().mockResolvedValue({ id: 1 }) },
    };

    svc = new PaymentsService(prisma as any);
  });

  it('should throw if bankAccountId is not found', async () => {
    (prisma.bankAccount.findUnique as any).mockResolvedValue(null);

    await expect(svc.createPaymentIn({
      customerId: 1,
      date: new Date().toISOString(),
      reference: 'R1',
      amountCfa: 1000,
      bankAccountId: 999,
    } as any)).rejects.toThrow(BadRequestException);
  });

  it('should create payment when bankAccount is valid', async () => {
    (prisma.bankAccount.findUnique as any).mockResolvedValue({ id: 2, active: true });
    (prisma.customer.findUnique as any).mockResolvedValue({ id: 1 });
    (prisma.paymentIn.create as any).mockResolvedValue({ id: 42 });

    const res = await svc.createPaymentIn({
      customerId: 1,
      date: new Date().toISOString(),
      reference: 'R2',
      amountCfa: 2000,
      bankAccountId: 2,
    } as any);

    expect(res).toEqual({ id: 42 });
  });
});
