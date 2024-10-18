import { TestBed } from '@angular/core/testing';

import { PeralsService } from './perals.service';

describe('PeralsService', () => {
  let service: PeralsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeralsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
