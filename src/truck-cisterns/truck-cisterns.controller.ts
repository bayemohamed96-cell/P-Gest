import { Controller, Get, UseGuards } from '@nestjs/common';
import { TruckCisternsService } from './truck-cisterns.service';

@Controller('truck-cisterns')
export class TruckCisternsController {
  constructor(private readonly truckCisternsService: TruckCisternsService) {}

  @Get()
  findAll() {
    return this.truckCisternsService.findAll();
  }
}