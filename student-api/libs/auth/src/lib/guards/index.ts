import { ApiKeyAuthGuard } from './apikey.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

export const guards = [
  JwtAuthGuard,
  LocalAuthGuard,
  ApiKeyAuthGuard
];

export * from './jwt-auth.guard';
export * from './local-auth.guard';
export * from './apikey.guard';
