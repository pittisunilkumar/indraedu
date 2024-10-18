import { ApiKeyStrategy } from './apikey.strategy';
import { JwtStrategy } from './jwt-strategy';
import { LocalStrategy } from './local-strategy';

export const strategies = [
  LocalStrategy,
  JwtStrategy,
  ApiKeyStrategy
];

export * from './jwt-strategy';
export * from './local-strategy';
export * from './apikey.strategy';
