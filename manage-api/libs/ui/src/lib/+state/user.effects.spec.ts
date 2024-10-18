import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import * as UserActions from './user.actions';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  let actions: Observable<any>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        UserEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(UserEffects);
  });

  describe('loadUser$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: UserActions.loadUser() });

      const expected = hot('-a-|', {
        a: UserActions.loadUserSuccess({ user: [] })
      });

      expect(effects.loadUser$).toBeObservable(expected);
    });
  });
});
