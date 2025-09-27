import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));

    const [lotsCount, customersCount, suppliersCount, monthInvoices] = await this.prisma.$transaction([
      this.prisma.lot.count(),
      this.prisma.customer.count(),
      this.prisma.supplier.count(),
      this.prisma.invoice.aggregate({
        _sum: { totalCfa: true },
        where: { issuedAt: { gte: monthStart } },
      }),
    ]);

    return {
      lots: lotsCount,
      customers: customersCount,
      suppliers: suppliersCount,
      monthRevenueCfa: monthInvoices._sum.totalCfa || 0,
      timestamp: new Date().toISOString(),
    };
  }

  async health() {
    // Simple liveness check (could extend to DB ping time)
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true, time: new Date().toISOString() };
  }

}
