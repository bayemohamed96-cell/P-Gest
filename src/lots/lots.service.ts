import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';
import { Product } from '@prisma/client';
import { TripPnlDto, LotsPnlResponseDto } from './dto/pnl.dto';

export function computePnlForTrip(trip: any): TripPnlDto & { [key: string]: any } {
  const costBuy = trip.capacityL * trip.priceBuyPerL;
  const costFreight = trip.capacityL * trip.freightPerL;
  const shortageNet = Math.max(0, (trip.shortageL || 0) - (trip.toleranceL || 0));
  const qtySellable = trip.capacityL - shortageNet;
  const revenue = qtySellable * trip.priceSellPerL;
  const taxes = (trip.transitCfa || 0) + (trip.customsCfa || 0) + (trip.miscCfa || 0);
  const totalCost = costBuy + costFreight + taxes;
  const margin = revenue - totalCost;

  return {
    tripId: trip.id,
    capacityL: trip.capacityL,
    costBuy,
    costFreight,
    shortageNet,
    qtySellable,
    revenue,
    taxes,
    totalCost,
    margin,
  };
}

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

    // Use a transaction to update the lot and replace trips atomically
    const ops: any[] = [];

    ops.push(this.prisma.lot.update({
      where: { id },
      data: {
        ...lotData,
        product: lotData.product ? (lotData.product as Product) : undefined,
        startedAt: lotData.startedAt ? new Date(lotData.startedAt) : undefined,
      },
    }));

    if (trips) {
      // Delete existing trips for the lot
      ops.push(this.prisma.lotTrip.deleteMany({ where: { lotId: id } }));

      // Create new trips if provided
      if (trips.length > 0) {
        ops.push(this.prisma.lotTrip.createMany({
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
        }));
      }
    }

    // Execute all operations in a transaction
    await this.prisma.$transaction(ops);

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

  /**
   * Calculate PnL for each trip of the lot and aggregated totals.
   */
  async calculatePnL(id: number): Promise<LotsPnlResponseDto> {
    // Minimal Prisma query to load lot trips and their numeric fields
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        trips: true,
      },
    });

    if (!lot) throw new NotFoundException('Lot not found');

    const trips = (lot.trips || []).map((t: any) => computePnlForTrip(t));

    // snake_case totals (new API)
    const totals_snake = trips.reduce(
      (acc, t) => {
        acc.capacity_l += t.capacityL || 0;
        acc.qty_sellable += t.qtySellable || 0;
        acc.revenue += t.revenue || 0;
        acc.total_cost += t.totalCost || 0;
        acc.margin += t.margin || 0;
        return acc;
      },
      { capacity_l: 0, qty_sellable: 0, revenue: 0, total_cost: 0, margin: 0 },
    );

    // camelCase totals for backward compatibility with existing tests/consumers
    const totals_camel = {
      totalRevenue: totals_snake.revenue,
      totalCost: totals_snake.total_cost,
      totalMargin: totals_snake.margin,
    };

    // legacy calculations shape (kept for existing tests)
    const calculations = trips.map((t: any) => ({
      tripId: t.tripId,
      costBuy: t.costBuy,
      costFreight: t.costFreight,
      shortageNet: t.shortageNet,
      qtySellable: t.qtySellable,
      revenue: t.revenue,
      taxes: t.taxes,
      totalCost: t.totalCost,
      margin: t.margin,
    }));

    return {
      trips,
      calculations,
      totals: Object.assign({}, totals_snake, totals_camel),
    } as any;
  }
}