import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
// Auth supprimée
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  @Get(':id/statement')
  getStatement(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.getStatement(id);
  }
}