import { JwtStrategy } from './jwt-strategy';
import { LocalStrategy } from './local-strategy';

export const strategies = [
  LocalStrategy,
  JwtStrategy,
];

export * from './jwt-strategy';
export * from './local-strategy';
