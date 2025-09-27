import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TruckCisternsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.truckCistern.findMany({
      where: { active: true },
      orderBy: { plate: 'asc' },
    });
  }
}