import { Controller, Get, UseGuards } from '@nestjs/common';
import { TruckTractorsService } from './truck-tractors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('truck-tractors')
export class TruckTractorsController {
  constructor(private readonly truckTractorsService: TruckTractorsService) {}

  @Get()
  findAll() {
    return this.truckTractorsService.findAll();
  }
}