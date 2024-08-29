import { TestBed } from '@angular/core/testing';

import { NewRideService } from './new-ride.service';

describe('NewRideService', () => {
  let service: NewRideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
