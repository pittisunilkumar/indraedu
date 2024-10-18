import { AuthGuard } from './auth.guard';
import { UserCanAccessGuard } from './user-can-access.guard';

export const guards = [
  AuthGuard, 
  UserCanAccessGuard
];

export * from './auth.guard';
export * from './user-can-access.guard';