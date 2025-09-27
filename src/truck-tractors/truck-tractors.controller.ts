import { Controller, Get, UseGuards } from '@nestjs/common';
import { TruckTractorsService } from './truck-tractors.service';

@Controller('truck-tractors')
export class TruckTractorsController {
  constructor(private readonly truckTractorsService: TruckTractorsService) {}

  @Get()
  findAll() {
    return this.truckTractorsService.findAll();
  }
}