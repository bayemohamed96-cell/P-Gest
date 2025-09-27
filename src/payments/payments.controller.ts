import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentInDto } from './dto/create-payment-in.dto';
import { CreatePaymentOutDto } from './dto/create-payment-out.dto';
// Auth supprimée
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('in')
  @HttpCode(HttpStatus.CREATED)
  createIn(@Body() dto: CreatePaymentInDto) {
    return this.paymentsService.createPaymentIn(dto);
  }

  @Post('out')
  @HttpCode(HttpStatus.CREATED)
  createOut(@Body() dto: CreatePaymentOutDto) {
    return this.paymentsService.createPaymentOut(dto);
  }
}
