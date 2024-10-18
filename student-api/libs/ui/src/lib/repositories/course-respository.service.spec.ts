import { TestBed } from '@angular/core/testing';

import { CourseRepositoryService } from './course-finder.service';

describe('CourseRepositoryService', () => {
  let service: CourseRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
