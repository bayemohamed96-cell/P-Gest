import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async getStatement(id: number) {
    const customer = await this.findOne(id);
    if (!customer) return null;

    const [invoices, payments] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { customerId: id },
        orderBy: { issuedAt: 'desc' },
      }),
      this.prisma.paymentIn.findMany({
        where: { customerId: id },
        orderBy: { date: 'desc' },
      }),
    ]);

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalCfa, 0);
    const totalPaid = payments.reduce((sum, pay) => sum + pay.amountCfa, 0);
    const balance = totalInvoiced - totalPaid;

    return {
      customer,
      invoices,
      payments,
      summary: {
        totalInvoiced,
        totalPaid,
        balance,
      },
    };
  }
}