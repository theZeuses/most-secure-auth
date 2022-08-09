import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthInput } from './dto';
import { FingerprintCookieInterceptor } from "./intercepter";
import { AuthSchema } from "./schemas/.";
import { Request } from "express";
import { RefreshJwtGuard, RefreshFingerprintGuard } from "./guard";
import { RefreshToken } from "./interfaces";

@Resolver(() => AuthSchema)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ){}

    @Query(() => AuthSchema)
    async Login(
        @Args('credentials') credentials: AuthInput,
        @Context("req") req: Request
    ){
        const { auth_token, fingerprint } = await this.authService.signIn(credentials);
        req.res?.cookie('fingerprint', fingerprint, {
            httpOnly: true,
            path: '/graphql',
            secure: true,
            signed: true,
            sameSite: 'strict'
        })
        return auth_token;
    }

    @Query(() => AuthSchema)
    @UseGuards(RefreshJwtGuard, RefreshFingerprintGuard)
    async RefreshToken(
        @Context("req") req: Request
    ){
        const { auth_token, fingerprint } = await this.authService.refreshToken(req.user as RefreshToken);
        req.res?.cookie('fingerprint', fingerprint, {
            httpOnly: true,
            path: '/graphql',
            secure: true,
            signed: true,
            sameSite: 'strict'
        })
        return auth_token;
    } 
}