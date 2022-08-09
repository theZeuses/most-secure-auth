import { AuthService } from "@modules/auth/auth.service";
import { Test } from "@nestjs/testing";
import { truncateTables } from "@scripts/typeorm_truncate_tables";
import { AppModule } from "@src/app.module";
import { UserEntity } from '@modules/users/entities';
import { UserService } from "@src/modules/users/user.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as argon from "argon2";
import { getRedisConnectionToken, Redis } from '@nestjs-modules/ioredis';

const REDIS_CONNECTION_TOKEN = getRedisConnectionToken();

describe('AuthService (int)', () => {
    let authService: AuthService;
    let userService: UserService;
    let redisService: Redis;
  
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      authService = moduleRef.get(AuthService);
      userService = moduleRef.get(UserService);
      redisService = moduleRef.get<Redis>(REDIS_CONNECTION_TOKEN);
      //database teardown
      await truncateTables();
      redisService.flushdb();
    });

    describe("root", () => {
        it('should be defined', () => {
            expect(authService).toBeDefined();
        });
    });

    describe('signTokens', () => {
        let tokenObj;
        beforeEach(async () => {
            const dto = {
                id: 1,
                username: 'guest',
                password: 'hashedguest'
            }
            jest.spyOn(argon, 'hash');
            //calling the actual function with stub (dto) and dummy (session_id, fingerprint)
            tokenObj = await authService.signTokens(dto, 'session_id', 'fingerprint');
        });
        
        it("should hash the fingerprint", () => {
            expect(argon.hash).toHaveBeenCalledWith('fingerprint');
        });

        it("should return two tokens and expiry timestamp", async () => {
            expect(tokenObj)
            .toHaveProperty('bearer_token');
            expect(tokenObj)
            .toHaveProperty('refresh_token');
            expect(tokenObj)
            .toHaveProperty('expires_in');
        });
    });

    describe("signIn", () => {
        let user: UserEntity;
        it('should insert a user first', async () => {
            user = await userService.create({
                username: 'guest',
                password: 'guest'
            });
            expect(user).toHaveProperty('username', 'guest');
        });

        it("should throw UnauthorizedException as invalid username given", async () => {
            await authService.signIn({
                username: 'wrong',
                password: 'guest'
            }).catch(err => expect(err).toBeInstanceOf(UnauthorizedException));
        });

        it("should throw UnauthorizedException as invalid password given", async () => {
            await authService.signIn({
                username: 'guest',
                password: 'wrong'
            }).catch(err => {
                expect(err).toBeInstanceOf(UnauthorizedException);
            })
        });

        it("should successfully sign in user and return auth_token an fingerprint", async () => {
            const result = await authService.signIn({
                username: 'guest',
                password: 'guest'
            })
            expect(result).toHaveProperty('auth_token');
            expect(result).toHaveProperty('fingerprint');
        });
    });
});