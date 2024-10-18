import { TestBed } from '@angular/core/testing';
import { HomeRepositoryService } from './home-repository.service';

describe('HomeRepositoryService', () => {
  let service: HomeRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
