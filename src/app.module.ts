import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { BanksModule } from './banks/banks.module';
import { PaymentsModule } from './payments/payments.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [
      PrismaModule,
      UsersModule,
      BanksModule,
      PaymentsModule,
      PurchaseOrdersModule,
      StatusModule,
  ],
})
export class AppModule {}