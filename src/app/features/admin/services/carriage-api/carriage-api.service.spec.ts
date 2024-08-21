import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CarriageApiService } from './carriage-api.service';

describe('CarriageApiService', () => {
  let service: CarriageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(CarriageApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
