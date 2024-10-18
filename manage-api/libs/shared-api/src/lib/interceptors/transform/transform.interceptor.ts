import { ResponseInterface } from '@application/api-interfaces';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseInterface<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseInterface<T>> {
    // console.log(context.switchToHttp().getRequest().originalUrl);
    let statusCode;
    let message = '';
    const schema = context.switchToHttp().getRequest().originalUrl
      .split('/proxy/api/')[1];
    const formatted = `${schema.charAt(0).toUpperCase()}${schema.slice(1)}`;
    // console.log(context.switchToHttp());

    switch(context.switchToHttp().getRequest().method) {
      case "GET": {
        statusCode = 200;
        message = `${formatted} fetched successfully`;
        break;
      }
      case "POST": {
        statusCode = 201;
        message = `${formatted} created successfully`;
        break;
      }
      case "PUT": {
        statusCode = 202;
        message = `${formatted} updated successfully`;
        break;
      }
      case "DELETE": {
        statusCode = 203;
        message = `${formatted} deleted successfully`;
        break;
      }
      default: {
        statusCode = 200;
        message = `${formatted} fetched successfully`;
        break;
      }
    }
    return next.handle().pipe(
      map(response => {
        console.log({ response});
        if(context.switchToHttp().getRequest().originalUrl.includes('vdocipher')) {
          return ({ ok: true, statusCode, message, response: response.data })
        } else {
          return ({ ok: true, statusCode, message, response });
        }
      }),
      catchError(error => {
        console.log({ error });

        const errors = [];
        if(Array.isArray(error.response?.error)){
          error.response?.error?.map(err => {
            console.log({ err });

            Object.values(err.constraints).map(it => {
              errors.push(it);
            });
          });
        }
        if(errors.length) {
          error.response.error = errors;
          error.response.ok = false;
        } else {
          error.response.ok = false;
        }
        console.log({error});

        return throwError(error);
      })
    );
  }
}
