import { TestBed } from '@angular/core/testing';

import {EmployeeRepositoryService } from './employee-repository.service';

describe('EmployeeRepository.Service.TsService', () => {
  let service: EmployeeRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
