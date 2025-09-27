import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentInDto } from './dto/create-payment-in.dto';
import { CreatePaymentOutDto } from './dto/create-payment-out.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private async ensureBankAccountValid(bankAccountId?: number) {
    if (bankAccountId == null) return;
  const account = await this.prisma.bankAccount.findUnique({ where: { id: bankAccountId } });
    if (!account) throw new BadRequestException('bankAccountId not found');
    if (!account.active) throw new BadRequestException('bank account is not active');
  }

  async createPaymentIn(dto: CreatePaymentInDto) {
    await this.ensureBankAccountValid(dto.bankAccountId);
    // Vérifier client
    const customer = await this.prisma.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    const data: any = {
      customerId: dto.customerId,
      date: new Date(dto.date),
      reference: dto.reference,
      amountCfa: dto.amountCfa,
      note: dto.note,
      bankAccountId: dto.bankAccountId ?? null,
    };
  return this.prisma.paymentIn.create({ data });
  }

  async createPaymentOut(dto: CreatePaymentOutDto) {
    await this.ensureBankAccountValid(dto.bankAccountId);
    // Vérifier fournisseur
    const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    const data: any = {
      supplierId: dto.supplierId,
      date: new Date(dto.date),
      reference: dto.reference,
      amountCfa: dto.amountCfa,
      note: dto.note,
      bankAccountId: dto.bankAccountId ?? null,
    };
  return this.prisma.paymentOut.create({ data });
  }
}
