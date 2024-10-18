import { TestBed } from '@angular/core/testing';
import { SubscriptionsRepositoryService } from './subscriptions-repository.service';

describe('SubscriptionsRepositoryService', () => {
  let service: SubscriptionsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
