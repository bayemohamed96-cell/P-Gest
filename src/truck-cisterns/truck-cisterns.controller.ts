import { Controller, Get } from '@nestjs/common';
import { TruckCisternsService } from './truck-cisterns.service';
// Auth supprimée
@Controller('truck-cisterns')
export class TruckCisternsController {
  constructor(private readonly truckCisternsService: TruckCisternsService) {}

  @Get()
  findAll() {
    return this.truckCisternsService.findAll();
  }
}