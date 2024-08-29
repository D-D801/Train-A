import { TestBed } from '@angular/core/testing';

import { RideApiService } from './ride-api.service';

describe('RideApiService', () => {
  let service: RideApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
