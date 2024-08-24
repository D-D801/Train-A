import { TestBed } from '@angular/core/testing';

import { DateTimeTransformerService } from './date-time-transformer.service';

describe('DateTimeTransformerService', () => {
  let service: DateTimeTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
