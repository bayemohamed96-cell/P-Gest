import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @MinLength(10)
  refreshToken: string;
}

export class LogoutDto {
  @IsString()
  @MinLength(10)
  refreshToken: string;
}