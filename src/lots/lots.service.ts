import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';
import { Product } from '@prisma/client';

@Injectable()
export class LotsService {
  constructor(private prisma: PrismaService) {}

  async create(createLotDto: CreateLotDto) {
    return this.prisma.lot.create({
      data: {
        lotCode: createLotDto.lotCode,
        product: createLotDto.product as Product,
        startedAt: new Date(createLotDto.startedAt),
        notes: createLotDto.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.lot.findMany({
      include: {
        trips: {
          include: {
            cistern: true,
            tractor: true,
            driver: true,
            destination: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.lot.findUnique({
      where: { id },
      include: {
        trips: {
          include: {
            cistern: true,
            tractor: true,
            driver: true,
            destination: true,
          },
        },
      },
    });
  }

  async update(id: number, updateLotDto: UpdateLotDto) {
    const { trips, ...lotData } = updateLotDto;
    
    // Mettre à jour le lot
    const updatedLot = await this.prisma.lot.update({
      where: { id },
      data: {
        ...lotData,
        product: lotData.product ? lotData.product as Product : undefined,
        startedAt: lotData.startedAt ? new Date(lotData.startedAt) : undefined,
      },
    });

    // Gérer les voyages si fournis
    if (trips) {
      // Supprimer les anciens voyages
      await this.prisma.lotTrip.deleteMany({
        where: { lotId: id },
      });

      // Créer les nouveaux voyages
      if (trips.length > 0) {
        await this.prisma.lotTrip.createMany({
          data: trips.map((trip: any) => ({
            lotId: id,
            cisternId: trip.cisternId,
            tractorId: trip.tractorId,
            driverId: trip.driverId,
            destinationId: trip.destinationId,
            capacityL: trip.capacityL,
            priceBuyPerL: trip.priceBuyPerL,
            freightPerL: trip.freightPerL,
            toleranceL: trip.toleranceL,
            shortageL: trip.shortageL || 0,
            priceSellPerL: trip.priceSellPerL,
            transitCfa: trip.transitCfa,
            customsCfa: trip.customsCfa,
            miscCfa: trip.miscCfa || 0,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async close(id: number) {
    return this.prisma.lot.update({
      where: { id },
      data: {
        closedAt: new Date(),
      },
    });
  }

  async calculatePnL(id: number) {
    const lot = await this.findOne(id);
    if (!lot) return null;

    const calculations = lot.trips.map((trip: any) => {
      const costBuy = trip.capacityL * trip.priceBuyPerL;
      const costFreight = trip.capacityL * trip.freightPerL;
      const shortageNet = Math.max(0, trip.shortageL - trip.toleranceL);
      const qtySellable = trip.capacityL - shortageNet;
      const revenue = qtySellable * trip.priceSellPerL;
      const taxes = trip.transitCfa + trip.customsCfa + (trip.miscCfa || 0);
      const totalCost = costBuy + costFreight + taxes;
      const margin = revenue - totalCost;

      return {
        tripId: trip.id,
        costBuy,
        costFreight,
        shortageNet,
        qtySellable,
        revenue,
        taxes,
        totalCost,
        margin,
      };
    });

    const totals = calculations.reduce(
      (acc, calc) => ({
        totalRevenue: acc.totalRevenue + calc.revenue,
        totalCost: acc.totalCost + calc.totalCost,
        totalMargin: acc.totalMargin + calc.margin,
      }),
      { totalRevenue: 0, totalCost: 0, totalMargin: 0 }
    );

    return {
      lot,
      calculations,
      totals,
    };
  }
}