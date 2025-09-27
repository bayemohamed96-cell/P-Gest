import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';
// Auth supprimée : contrôleur public
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('summary')
  summary() {
    return this.statusService.summary();
  }

  @Get('health')
  health() {
    return this.statusService.health();
  }
}
