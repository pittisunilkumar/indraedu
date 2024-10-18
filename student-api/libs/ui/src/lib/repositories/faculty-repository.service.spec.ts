import { TestBed } from '@angular/core/testing';

import { FacultyRepositoryService } from './faculty-repository.service';

describe('FacultyRepositoryService', () => {
  let service: FacultyRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultyRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
