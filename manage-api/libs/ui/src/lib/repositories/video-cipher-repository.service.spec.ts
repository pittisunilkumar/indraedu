import { TestBed } from '@angular/core/testing';

import { VideoCipherRepositoryService } from './video-cipher-repository.service';

describe('VideoCipherRepositoryService', () => {
  let service: VideoCipherRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoCipherRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
