import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-po.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  private async ensureBankAccountValid(bankAccountId?: number) {
    if (bankAccountId == null) return;
    const account = await this.prisma.bankAccount.findUnique({ where: { id: bankAccountId } });
    if (!account) throw new BadRequestException('bankAccountId not found');
    if (!account.active) throw new BadRequestException('bank account is not active');
  }

  async createPO(dto: CreatePurchaseOrderDto) {
    await this.ensureBankAccountValid(dto.bankAccountId);
    const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    const data: any = {
      supplierId: dto.supplierId,
      cmdNo: dto.cmdNo,
      product: dto.product,
      qtyOrderedL: dto.qtyOrderedL,
      priceBuyPerL: dto.priceBuyPerL,
      transitCfa: dto.transitCfa,
      customsCfa: dto.customsCfa,
      bankAccountId: dto.bankAccountId ?? null,
    };
    return this.prisma.purchaseOrder.create({ data });
  }
}
