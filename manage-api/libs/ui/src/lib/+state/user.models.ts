/**
 * Interface for the 'User' data
 */
export interface UserEntity {
  pending: boolean;
  loaded: boolean; // has the User list been loaded
  error?: string | null; // last none error (if any)
  selectedId?: string | number; // which User record has been selected
  response: any;
  userInfo: any;
}
