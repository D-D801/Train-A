import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { StationsService } from './stations.service';

describe('StationsService', () => {
  let service: StationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(StationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
