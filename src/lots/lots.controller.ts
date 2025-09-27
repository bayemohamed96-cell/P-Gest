import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(+id, updateLotDto);
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.lotsService.close(+id);
  }

  @Get(':id/pnl')
  getPnL(@Param('id') id: string) {
    return this.lotsService.calculatePnL(+id);
  }
}