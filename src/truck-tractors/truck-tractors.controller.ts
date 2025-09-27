import { Controller, Get } from '@nestjs/common';
import { TruckTractorsService } from './truck-tractors.service';
// Auth supprimée
@Controller('truck-tractors')
export class TruckTractorsController {
  constructor(private readonly truckTractorsService: TruckTractorsService) {}

  @Get()
  findAll() {
    return this.truckTractorsService.findAll();
  }
}