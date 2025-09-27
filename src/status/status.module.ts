import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StatusService, PrismaService],
  controllers: [StatusController],
})
export class StatusModule {}
