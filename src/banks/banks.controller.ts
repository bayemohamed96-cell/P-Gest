import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
// Authentification supprimée : contrôleur public
@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBank(@Body() dto: CreateBankDto) {
    return this.banksService.createBank(dto);
  }

  @Get()
  findAll() {
    return this.banksService.findAllBanks();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.findBank(id);
  }

  @Post(':id/accounts')
  @HttpCode(HttpStatus.CREATED)
  createAccount(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateBankAccountDto) {
    // ensure path id matches body.bankId
    dto.bankId = id;
    return this.banksService.createAccount(dto);
  }

  @Get('accounts')
  listAccounts() {
    return this.banksService.findAccounts();
  }

  @Get('accounts/:id')
  getAccount(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.findAccount(id);
  }

  @Put(':id')
  updateBank(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBankDto) {
    return this.banksService.updateBank(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBank(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.deleteBank(id);
  }

  @Put('accounts/:id')
  updateAccount(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBankAccountDto) {
    return this.banksService.updateAccount(id, dto);
  }

  @Delete('accounts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.banksService.deleteAccount(id);
  }
}
