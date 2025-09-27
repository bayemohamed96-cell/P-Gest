import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  async getStatement(id: number) {
    const supplier = await this.findOne(id);
    if (!supplier) return null;

    const [purchaseOrders, payments] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where: { supplierId: id },
        include: { receipts: true },
        orderBy: { orderedAt: 'desc' },
      }),
      this.prisma.paymentOut.findMany({
        where: { supplierId: id },
        orderBy: { date: 'desc' },
      }),
    ]);

    // Calculer les totaux pour chaque commande
    const enrichedPOs = purchaseOrders.map(po => {
      const totalReceived = po.receipts.reduce((sum, receipt) => sum + receipt.qtyReceivedL, 0);
      const remainder = po.qtyOrderedL - totalReceived;
      const totalValue = po.qtyOrderedL * po.priceBuyPerL + po.transitCfa + po.customsCfa;
      
      return {
        ...po,
        totalReceived,
        remainder,
        totalValue,
      };
    });

    const totalOrdered = enrichedPOs.reduce((sum, po) => sum + po.totalValue, 0);
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amountCfa, 0);
    const balance = totalOrdered - totalPaid;
    const totalRemainder = enrichedPOs.reduce((sum, po) => sum + po.remainder, 0);

    return {
      supplier,
      purchaseOrders: enrichedPOs,
      payments,
      summary: {
        totalOrdered,
        totalPaid,
        balance,
        totalRemainder,
      },
    };
  }
}