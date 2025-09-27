import { Module } from '@nestjs/common';
import { TruckTractorsService } from './truck-tractors.service';
import { TruckTractorsController } from './truck-tractors.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TruckTractorsController],
  providers: [TruckTractorsService],
})
export class TruckTractorsModule {}