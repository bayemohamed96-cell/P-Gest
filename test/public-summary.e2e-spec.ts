import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

// Test e2e minimal après suppression de l'authentification
// Vérifie que l'endpoint public /api/status/summary répond et possède les clés attendues.

describe('Status summary public (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/status/summary renvoie les compteurs attendus', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/status/summary')
      .expect(200);

    expect(res.body).toHaveProperty('lots');
    expect(res.body).toHaveProperty('customers');
    expect(res.body).toHaveProperty('suppliers');
    expect(res.body).toHaveProperty('monthRevenueCfa');
  });
});