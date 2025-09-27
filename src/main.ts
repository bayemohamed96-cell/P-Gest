import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as net from 'net';
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

  // Configuration CORS : autorise listes + fallback localhost:5173/5174 + pattern dev
  const envOrigins = getCorsOrigins();
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const allowed = envOrigins.length ? envOrigins : defaultOrigins;

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // origin peut être undefined (requêtes same-origin ou outils CLI)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      // Autoriser tout localhost:51xx pour dev rapide
      if (/^http:\/\/localhost:51\d{2}$/.test(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin ${origin}`), false);
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
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
  
  // Pré-scan des ports pour éviter exit code 1 sur listen (3000 -> 3005)
  const basePort = parseInt(process.env.PORT || '3000', 10) || 3000;
  const maxAttempts = 6;

  async function findFreePort(start: number, attempts: number): Promise<number> {
    for (let i = 0; i < attempts; i++) {
      const candidate = start + i;
      const free = await isPortFree(candidate);
      if (free) {
        if (i > 0) {
          console.warn(`ℹ️ Port ${start} indisponible. Utilisation du port alternatif ${candidate}.`);
        }
        return candidate;
      }
    }
    throw new Error(`Aucun port libre entre ${start} et ${start + attempts - 1}`);
  }

  function isPortFree(port: number): Promise<boolean> {
    return new Promise(resolve => {
      const tester = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          tester.close(() => resolve(true));
        })
        .listen(port);
    });
  }

  const port = await findFreePort(basePort, maxAttempts);
  await app.listen(port);
  console.log(`🚀 Serveur NestJS démarré sur le port ${port}`);
  console.log(`📡 API disponible sur http://localhost:${port}/api`);
}

bootstrap();