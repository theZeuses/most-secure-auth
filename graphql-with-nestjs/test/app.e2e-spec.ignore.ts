import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { truncateTables } from '@scripts/typeorm_truncate_tables';

describe('Entry Point (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let moduleRef: TestingModule;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    await truncateTables()
  });

  afterAll(async () => {
    await app.close();
  });

  describe('heartbeat', () => {
    it('should say "Hello"', async () => {
      const response = await request(httpServer)
        .post('/graphql')
        .send({
          query: 
            `{
              sayHello
            }`
        });

        expect(response.statusCode).toBe(200);
    });
  });
});
