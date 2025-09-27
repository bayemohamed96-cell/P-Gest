import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LotsService } from './lots.service';
import { CreateLotDto, UpdateLotDto } from './dto/lot.dto';
import { UpdateLotTripsDto } from './dto/update-lot-trips.dto';
import { LotsPnlResponseDto } from './dto/pnl.dto';
// Auth & rôles supprimés

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.updateMeta(id, updateLotDto);
  }

  @Patch(':id/trips')
  replaceTrips(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLotTripsDto) {
    return this.lotsService.replaceTrips(id, dto.trips);
  }

  @Post(':id/close')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.lotsService.close(id);
  }

  @Get(':id/pnl')
  getPnL(@Param('id', ParseIntPipe) id: number): Promise<LotsPnlResponseDto> {
    return this.lotsService.calculatePnL(id);
  }

  @Post(':id/import-xlsx')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async importXlsx(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: any) {
    return this.lotsService.importXlsx(id, file);
  }
}