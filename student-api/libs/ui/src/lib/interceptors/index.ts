import { HttpInterceptorService } from './http-interceptor.service';
import { TokenInterceptor } from './token-interceptor.service';

export const interceptors = [
  TokenInterceptor,
  HttpInterceptorService
];

export * from './http-interceptor.service';
export * from './token-interceptor.service';
