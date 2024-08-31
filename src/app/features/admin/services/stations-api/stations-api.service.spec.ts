import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StationsApiService } from './stations-api.service';

describe('StationsApiService', () => {
  let service: StationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(StationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
