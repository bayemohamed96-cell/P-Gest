import { Module } from '@nestjs/common';
import { TruckCisternsService } from './truck-cisterns.service';
import { TruckCisternsController } from './truck-cisterns.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TruckCisternsController],
  providers: [TruckCisternsService],
})
export class TruckCisternsModule {}