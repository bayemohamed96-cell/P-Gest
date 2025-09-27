import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';
import { LotsPnlResponseDto } from './dto/pnl.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @Roles('ADMIN','MANAGER')
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lotsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN','MANAGER')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(id, updateLotDto);
  }

  @Post(':id/close')
  @Roles('ADMIN','MANAGER')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.lotsService.close(id);
  }

  @Get(':id/pnl')
  getPnL(@Param('id', ParseIntPipe) id: number): Promise<LotsPnlResponseDto> {
    return this.lotsService.calculatePnL(id);
  }
}