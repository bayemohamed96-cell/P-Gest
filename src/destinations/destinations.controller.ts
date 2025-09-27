import { Controller, Get } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
// Auth supprimée
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  findAll() {
    return this.destinationsService.findAll();
  }
}