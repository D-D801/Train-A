import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { OrderApiService } from './order-api.service';

describe('OrderService', () => {
  let service: OrderApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(OrderApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
