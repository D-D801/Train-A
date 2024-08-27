import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CarriageService } from './carriage.service';

describe('CariageService', () => {
  let service: CarriageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CarriageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
