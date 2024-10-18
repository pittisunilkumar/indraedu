import { Employee, User } from '@application/shared-api';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private moduleRef: ModuleRef, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'platoonlinesaasplatform',
    });
  }

  // async validate(request, mobile: number, password: string): Promise<User> {
  //   const contextId = ContextIdFactory.getByRequest(request);
  //   // "AuthService" is a request-scoped provider
  //   // const authService = await this.moduleRef.resolve(AuthService, contextId);
  //   // console.log(mobile, password);
  //   console.log('JwtStrategy validate', { request });

  //   return this.authService.validateUser(request).then((user) => {
  //     if (!user) {
  //       throw new UnauthorizedException();
  //     }

  //     return user;
  //   });
  // }

  async validate(request, mobile: number, password: string): Promise<Employee> {
    const contextId = ContextIdFactory.getByRequest(request);
    // "AuthService" is a request-scoped provider
    // const authService = await this.moduleRef.resolve(AuthService, contextId);
    // console.log(mobile, password);
    // console.log('JwtStrategy validate', { request });

    return this.authService.validateUser(request).then((user) => {
      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    });
  }


  // async validate(request: { mobile: number, password: string }) {
  //   return { mobile: request.mobile, password: request.password };
  // }
}
