import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private authService: AuthService, private configService: ConfigService) {

    super({ header: configService.get<string>('HEADER_KEY_API_KEY') || '', prefix: '' }, true, async (apiKey, done) => {

      if (this.authService.validateApiKey(apiKey)) {
        done(null, true);
      }
      done(new HttpException({
        "status": false, "code": 2004, 'message': 'Invalid Api Key', 'data': []
      }, HttpStatus.FORBIDDEN), null);
    });
  }
}