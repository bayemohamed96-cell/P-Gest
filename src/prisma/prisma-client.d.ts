import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    // declare common model accessors as any so TS won't error when generated client isn't present in analysis env
    bank?: any;
    bankAccount?: any;
    paymentIn?: any;
    paymentOut?: any;
    purchaseOrder?: any;
    // allow indexer
    [key: string]: any;
  }
}

// Also export type augmentation for PrismaService
declare module '../../prisma/prisma.service' {}
