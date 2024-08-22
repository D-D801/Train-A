import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LocationApiService } from './location-api.service';

describe('LocationApiService', () => {
  let service: LocationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LocationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
