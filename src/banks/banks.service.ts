import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';

@Injectable()
export class BanksService {
  constructor(private prisma: PrismaService) {}

  async createBank(dto: CreateBankDto) {
    return this.prisma.bank.create({ data: dto });
  }

  async findAllBanks() {
    return this.prisma.bank.findMany({ include: { accounts: true } });
  }

  async findBank(id: number) {
    const b = await this.prisma.bank.findUnique({ where: { id }, include: { accounts: true } });
    if (!b) throw new NotFoundException('Bank not found');
    return b;
  }

  async createAccount(dto: CreateBankAccountDto) {
    const bank = await this.prisma.bank.findUnique({ where: { id: dto.bankId } });
    if (!bank) throw new NotFoundException('Bank not found');
    return this.prisma.bankAccount.create({ data: {
      bankId: dto.bankId,
      accountNo: dto.accountNo,
      name: dto.name,
      currency: dto.currency || 'XOF',
      active: dto.active ?? true,
    } });
  }

  async findAccounts() {
    return this.prisma.bankAccount.findMany({ include: { bank: true } });
  }

  async findAccount(id: number) {
    const a = await this.prisma.bankAccount.findUnique({ where: { id }, include: { bank: true } });
    if (!a) throw new NotFoundException('Bank account not found');
    return a;
  }

  async updateBank(id: number, data: any) {
    const b = await this.prisma.bank.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Bank not found');
    return this.prisma.bank.update({ where: { id }, data });
  }

  async deleteBank(id: number) {
    const b = await this.prisma.bank.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Bank not found');
    return this.prisma.$transaction([
      this.prisma.bankAccount.deleteMany({ where: { bankId: id } }),
      this.prisma.bank.delete({ where: { id } }),
    ]);
  }

  async updateAccount(id: number, data: any) {
    const a = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Bank account not found');
    return this.prisma.bankAccount.update({ where: { id }, data });
  }

  async deleteAccount(id: number) {
    const a = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Bank account not found');
    return this.prisma.bankAccount.delete({ where: { id } });
  }
}
