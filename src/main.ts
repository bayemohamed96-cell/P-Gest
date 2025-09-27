import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';

// Parse CORS origins from environment variable CORS_ORIGIN (comma separated)
function getCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN || '';
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS dynamiquement depuis CORS_ORIGIN
  const origins = getCorsOrigins();
  app.enableCors({
    origin: origins.length ? origins : ['http://localhost:5173'],
    credentials: true,
  });
  
  // Préfixe global pour l'API
  app.setGlobalPrefix('api');
  
  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Serveur NestJS démarré sur le port ${port}`);
  console.log(`📡 API disponible sur http://localhost:${port}/api`);
}

bootstrap();