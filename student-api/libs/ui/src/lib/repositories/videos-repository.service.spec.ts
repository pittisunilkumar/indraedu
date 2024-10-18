import { TestBed } from '@angular/core/testing';

import { VideosRepositoryService } from './videos-repository.service';

describe('VideosRepositoryService', () => {
  let service: VideosRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
