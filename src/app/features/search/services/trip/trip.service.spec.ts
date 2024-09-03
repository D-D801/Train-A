import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CarriageService } from '@core/services/carriage/carriage.service';
import { TripService } from './trip.service';

describe('RideService', () => {
  let service: TripService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: CarriageService,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
