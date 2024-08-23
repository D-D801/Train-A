import { TestBed } from '@angular/core/testing';

import { StationsApiService } from './stations-api.service';

describe('StationsApiService', () => {
  let service: StationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
