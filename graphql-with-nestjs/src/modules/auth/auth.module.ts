import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy, RefreshJwtStrategy } from './strategy';
import { UserModule } from '@modules/users/user.module';
import { AuthResolver } from './auth.resolver';
import { RefreshFingerprintGuard } from './guard/refresh-fingerprint.guard';

@Global()
@Module({
  imports: [
  JwtModule.register({}), 
    PassportModule,
    UserModule
  ],
  controllers: [],
  providers: [AuthService, AuthResolver, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
