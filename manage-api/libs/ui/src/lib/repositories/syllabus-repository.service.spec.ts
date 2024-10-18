import { TestBed } from '@angular/core/testing';
import { SyllabusRepositoryService } from './syllabus-repository.service';

describe('SyllabusRepositoryService', () => {
  let service: SyllabusRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyllabusRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
