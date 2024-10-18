import { TestBed } from '@angular/core/testing';

import { TagsRepositoryService } from './tags-repository.service';

describe('TagsRepositoryService', () => {
  let service: TagsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
