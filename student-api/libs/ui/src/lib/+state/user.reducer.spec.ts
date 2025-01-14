import * as UserActions from './user.actions';
import { UserEntity } from './user.models';
import { initialState, reducer, State } from './user.reducer';

describe('User Reducer', () => {
  const createUserEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as UserEntity);

  beforeEach(() => {});

  describe('valid User actions', () => {
    it('loadUserSuccess should return set the list of known User', () => {
      const user = [
        createUserEntity('PRODUCT-AAA'),
        createUserEntity('PRODUCT-zzz')
      ];
      const action = UserActions.loadUserSuccess({ user });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
