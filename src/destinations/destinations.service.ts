import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.destination.findMany({
      orderBy: { name: 'asc' },
    });
  }
}