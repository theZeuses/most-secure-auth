import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { truncateTables } from '@src/scripts/typeorm_truncate_tables';
import { UserService } from '@src/modules/users/user.service';
import { getRedisConnectionToken, Redis } from '@nestjs-modules/ioredis';
import { UserEntity } from '@src/modules/users/entities';
import * as cookieParser from 'cookie-parser';

const REDIS_CONNECTION_TOKEN = getRedisConnectionToken();

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let moduleRef: TestingModule;
  let userService: UserService;
  let redisService: Redis;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Add cors
    app.enableCors({
        credentials: true,
        origin: true,
    });
    // Add cookie parser
    app.use(cookieParser('superdupersecrethuh'));
    await app.init();
    httpServer = app.getHttpServer();
    userService = moduleRef.get<UserService>(UserService);
    redisService = moduleRef.get<Redis>(REDIS_CONNECTION_TOKEN);
    await truncateTables();
    redisService.flushdb();
  });

  afterAll(async () => {
    await redisService?.disconnect();
    await app.close();
  });

  describe('login', () => {
    let user: UserEntity;
    let cookie;
    it('should insert a user first', async () => {
        user = await userService.create({
            username: 'guest',
            password: 'guest'
        });
        expect(user).toHaveProperty('username', 'guest');
    });

    let refreshToken: string;

    it('should successfully login user', async () => {
      const response = await request(httpServer)
        .post('/graphql')
        .send({
            query: 
                `query {
                    Login(credentials: {username: "guest", password: "guest"}){
                        bearer_token
                        refresh_token
                        expires_in
                    }
                }`
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            data: {
                Login: {
                    bearer_token:{},
                    refresh_token: {},
                    expires_in:{}
                }
            }
        });
        expect(response.headers['set-cookie'][0].slice(0, 11)).toEqual('fingerprint');
        refreshToken = response.body.data.Login.refresh_token;
        cookie = response.headers['set-cookie'];
    });

    it('should successfully fetch new token in exchange of refresh token', async () => {
      const response = await request(httpServer)
        .post('/graphql')
        .set('Authorization', `Bearer ${refreshToken}`)
        .set('Cookie', cookie)
        .send({
            query: 
                `query {
                    RefreshToken {
                        bearer_token
                        refresh_token
                        expires_in
                    }
                }`
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            data: {
                RefreshToken: {
                    bearer_token:{},
                    refresh_token: {},
                    expires_in:{}
                }
            }
        });
        expect(response.headers['set-cookie'][0].slice(0, 11)).toEqual('fingerprint');
    });
  });
});
