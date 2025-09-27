import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; password: string; name: string; role?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as any || 'OPERATOR',
      },
    });
  }

  // Find user by id (used by AuthService)
  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAllWithRefresh() {
    // Cast temporaire en attendant la régénération du client Prisma incluant refreshTokenHash
    return this.prisma.user.findMany({ where: ({ refreshTokenHash: { not: null } } as any) });
  }

  // Store hashed refresh token for a user
  async setRefreshTokenHash(userId: number, hash: string) {
    // cast data to any to avoid TypeScript errors until prisma client is regenerated after schema changes
    return this.prisma.user.update({ where: { id: userId }, data: ({ refreshTokenHash: hash } as any) });
  }

  // Clear stored refresh token hash
  async clearRefreshTokenHash(userId: number) {
    return this.prisma.user.update({ where: { id: userId }, data: ({ refreshTokenHash: null } as any) });
  }
}