import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

export const guards = [
  JwtAuthGuard,
  LocalAuthGuard,
];

export * from './jwt-auth.guard';
export * from './local-auth.guard';
