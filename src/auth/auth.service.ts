import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    // Generate refresh token (random string), store hash in DB
    const refreshToken = randomBytes(48).toString('hex');
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    // store hashed refresh token
    await this.usersService.setRefreshTokenHash(user.id, hashedRefresh);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string, role?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'OPERATOR',
    });

    const payload = { sub: user.id, email: user.email, role: user.role };

    // create refresh token for new user
    const refreshToken = randomBytes(48).toString('hex');
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshTokenHash(user.id, hashedRefresh);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !(user as any).refreshTokenHash) {
      throw new BadRequestException('Invalid refresh token');
    }
    const isMatch = await bcrypt.compare(refreshToken, (user as any).refreshTokenHash);
    if (!isMatch) throw new BadRequestException('Invalid refresh token');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const newAccess = this.jwtService.sign(payload);
    // Optionally rotate refresh token
    const newRefresh = randomBytes(48).toString('hex');
    const hashedNew = await bcrypt.hash(newRefresh, 10);
    await this.usersService.setRefreshTokenHash(user.id, hashedNew);

    return { access_token: newAccess, refresh_token: newRefresh };
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshTokenHash(userId);
    return { ok: true };
  }
}