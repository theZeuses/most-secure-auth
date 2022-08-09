import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@modules/users/user.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { AuthInput } from './dto';
import { UserInput } from '@modules/users/dto';
import { v4 as uuid } from 'uuid';
import { RefreshToken } from './interfaces/refresh-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRedis() private redis: Redis
  ) {}

  async signIn(dto: AuthInput) {
    const user = await this.checkUserByUsername(dto.username);
    await this.validateUser(user, dto.password);
    const sessionId = await this.generateSession(user);
    const fingerprint = await this.generateFingerprint();
    return {
      auth_token: await this.signTokens(user, sessionId, fingerprint),
      fingerprint
    }
  }

  async refreshToken(dto: RefreshToken){
    const user = await this.userService.findOneById(parseInt(dto.user_id.toString()));
    if(!user){
      await this.deleteSession(dto.user_id.toString(), dto.session);
      throw new ForbiddenException();
    }
    const fingerprint = await this.generateFingerprint();
    return {
      auth_token: await this.signTokens(user, dto.session, fingerprint),
      fingerprint
    }
  }

  /**
   * sign tokens for user
   * @date 2022-07-18
   * @param {any} user:User
   * @returns {Promise<object>}
   */
  async signTokens( user: UserInput, session: string, fingerprint: string ): Promise<{ bearer_token: string, refresh_token: string, expires_in: number}> {
    const expires_in = Date.now() + (15 * 24 * 60 * 60);
    //define payloads
    const bearerPayload = {
      user_id: user.id
    };
    const refreshPayload = {
      session,
      user_id: user.id,
      fingerprint: await argon.hash(fingerprint)
    }
    const bearerSecret = this.config.get('JWT_BEARER_SECRET');
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

    //generate a bearer token
    const bearerToken = await this.jwt.signAsync(
      bearerPayload,
      {
        expiresIn: '1m',
        secret: bearerSecret,
      },
    );

    //generate a refresh token
    const refreshToken = await this.jwt.signAsync(
      refreshPayload,
      {
        expiresIn: '15d',
        secret: refreshSecret,
      },
    );

    return {
      bearer_token: bearerToken,
      refresh_token: refreshToken,
      expires_in
    };
  }

  /**
   * get user by username if exists
   * @date 2022-07-19
   * @param {string} username:string
   * @returns {User}
   */
  async checkUserByUsername(username: string){
    // find the user by username
    const user = await this.userService.findOneByUsername(username);
    // if user does not exist throw exception
    if (!user)
      throw new UnauthorizedException(
        'Incorrect Credentials',
      );
    return user;
  }

  /**
   * validate user against password
   * @date 2022-07-19
   * @param {any} user:UserInput
   * @param {any} password:string
   * @returns {boolean}
   */
  async validateUser(user: UserInput, password: string){
    // compare password
    const passwordMatches = await argon.verify(
      user.password,
      password,
    );
    // if password incorrect throw exception
    if (!passwordMatches)
      throw new UnauthorizedException(
        'Incorrect Credentials',
      );
    return true;
  }

  async generateSession(user: UserInput){
    const sessionId = uuid();
    await this.redis.lpush(user.id.toString(), sessionId);
    return sessionId;
  }

  async isValidSession(user_id: string, sessionId){
    const list = await this.redis.lrange(user_id, 0, -1);
    let valid = false;
    list.map(item => {
      if(item == sessionId) valid = true;
    })
    return valid;
  }

  async deleteSession(user_id: string, sessionId){
    return this.redis.lrem(user_id, 1, sessionId);
  }

  async generateFingerprint(){
    return uuid();
  }
}
