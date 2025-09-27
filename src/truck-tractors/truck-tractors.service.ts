import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TruckTractorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.truckTractor.findMany({
      where: { active: true },
      orderBy: { plate: 'asc' },
    });
  }
}