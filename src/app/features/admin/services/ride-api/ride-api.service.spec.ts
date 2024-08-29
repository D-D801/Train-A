import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { RideApiService } from './ride-api.service';

describe('RideApiService', () => {
  let service: RideApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(RideApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
