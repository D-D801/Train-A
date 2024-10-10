import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { RouteApiService } from './route-api.service';

describe('RouteApiService', () => {
  let service: RouteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(RouteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
