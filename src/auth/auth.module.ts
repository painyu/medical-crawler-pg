import { Module, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guard/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "766f37b0-2ddc-11ef-8e42-4b44796b1331",
      signOptions: {
        expiresIn: '12h'
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
  exports: [AuthService]
})
export class AuthModule { }
