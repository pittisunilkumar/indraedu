import { UserEntity } from './user.models';
import { initialState, State, userAdapter } from './user.reducer';
import * as UserSelectors from './user.selectors';

describe('User Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getUserId = it => it['id'];
  const createUserEntity = (id: string, name = '') =>
    ({} as UserEntity);

  let state;

  beforeEach(() => {
    state = {
      user: userAdapter.setAll(
        [
          createUserEntity('PRODUCT-AAA'),
          createUserEntity('PRODUCT-BBB'),
          createUserEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('User Selectors', () => {
    it('getAllUser() should return the list of User', () => {
      const results = UserSelectors.getAllUser(state);
      const selId = getUserId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = UserSelectors.getSelected(state);
      const selId = getUserId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getUserLoaded() should return the current 'loaded' status", () => {
      const result = UserSelectors.getUserLoaded(state);

      expect(result).toBe(true);
    });

    it("getUserError() should return the current 'error' state", () => {
      const result = UserSelectors.getUserError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
