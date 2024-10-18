import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // console.log({ context });

    // createParamDecorator((data, req) => {
    //   console.log({ data, req });
    //   return req.user;
    // });
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    // console.log({ err, user, info });

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
