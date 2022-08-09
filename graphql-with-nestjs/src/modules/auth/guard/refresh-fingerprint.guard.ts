import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as argon from 'argon2';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshFingerprintGuard implements CanActivate {
    constructor(private readonly authService: AuthService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { user, signedCookies } = ctx.getContext().req; 
        if(!user || !signedCookies || !signedCookies.fingerprint) return false
        const valid = await this.authService.isValidSession(user.user_id, user.session);
        if(!valid) return false;
        if(!await argon.verify(user.fingerprint, signedCookies.fingerprint)){
            await this.authService.deleteSession(user.user_id, user.session);
            return false;
        }
        return true;
    }
}