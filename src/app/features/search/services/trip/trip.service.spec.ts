import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { TripService } from './trip.service';

describe('RideService', () => {
  let service: TripService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
