import { SharedApiModule } from '@application/shared-api';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import * as fromStrategies from './strategies';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: 'platoonlinesaasplatform',
      signOptions: { expiresIn: '1d' },
    }),
    SharedApiModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...fromStrategies.strategies],
  exports: [AuthService],
})
export class AuthModule {}
