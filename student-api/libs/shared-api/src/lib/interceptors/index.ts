import { TransformInterceptor } from './transform/transform.interceptor';

export const interceptors = [
  TransformInterceptor,
];

export * from './transform/transform.interceptor';